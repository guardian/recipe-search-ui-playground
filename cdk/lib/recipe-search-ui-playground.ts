import type { GuStackProps} from '@guardian/cdk/lib/constructs/core';
import { GuStack, GuStringParameter } from '@guardian/cdk/lib/constructs/core';
import type { App} from 'aws-cdk-lib';
import { aws_ssm, CfnOutput } from 'aws-cdk-lib';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Distribution, HttpVersion } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';

const app = "recipe-search-ui-playground";

const hostingDomain:Record<string,string> = {
  "PROD": "recipe-search.capi.gutools.co.uk",
  "TEST": "recipe-search.test.capi.dev-gutools.co.uk"
}

export class RecipeSearchUiPlayground extends GuStack {
  constructor(scope: App, id: string, props: GuStackProps) {
    super(scope, id, props);

    const webAclId = aws_ssm.StringParameter.valueForStringParameter(this, `/account/services/waf/default-ruleset-arn`);

    const staticBucketNameParam = new GuStringParameter(this, "StaticBucketName", {
      fromSSM: true,
      default: `/account/services/static.serving.bucket`,
      description: "SSM parameter giving the name of a bucket which is to be used for static hosting"
    });

    const hostingBucket = Bucket.fromBucketName(this, "StaticBucket", staticBucketNameParam.valueAsString);


    //We can't create the cert here, because it must live in us-east-1 for Cloudfront to use it.
    const hostingCertArn = new GuStringParameter(this, "DistroCertArn", {
      fromSSM: true,
      default: `/${this.stage}/${this.stack}/${app}/GlobalCertArn`,
      description: `Cert to use for recipe search UI playground ${this.stage}. This must reside in us-east-1`,
    });
    const hostingCert = Certificate.fromCertificateArn(this, "SearchPlaygroundCert", hostingCertArn.valueAsString);

    const cloudFrontDistro = new Distribution(this, "SearchPlaygroundDist", {
      certificate: hostingCert,
      defaultRootObject: "index.html",
      domainNames: [hostingDomain[this.stage]!],
      enableLogging: false,
      errorResponses: [],
      httpVersion: HttpVersion.HTTP2_AND_3,
      webAclId,
      defaultBehavior: {
        origin: new S3Origin(hostingBucket, {
          originPath: `/${this.stage}/${app}`
        })
      }
    });

    hostingBucket.addToResourcePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [
        new ServicePrincipal("cloudfront.amazonaws.com")
      ],
      actions: ["s3:GetObject"],
      resources: [`arn:aws:s3:::${hostingBucket.bucketName}/${app}/*`],
      conditions: {
        "StringEquals": {
          "AWS::SourceArn": `arn:aws:cloudfront::${this.account}:distribution/${cloudFrontDistro.distributionId}`
        }
      }
    }));

    new CfnOutput(this, "DistroUrlOut", {
      value: cloudFrontDistro.distributionDomainName,
    });

  }
}
