import { Input, InputProps } from '@mui/material';
import { useEffect, useState } from 'react';

type DebouncedInputProps = InputProps & {
  timeout: number,
  initialValue: string,
  onUpdated: (newValue:string)=>void;
}

export const DebouncedInput = (props:DebouncedInputProps) => {
  const [currentText, setCurrentText] = useState("");

  const {timeout, onUpdated} = props;

  useEffect(()=>{
    const tmrId = window.setTimeout(()=>onUpdated(currentText), timeout);
    return ()=>window.clearTimeout(tmrId);
  }, [currentText, onUpdated, timeout]);

  useEffect(() => {
    setCurrentText(props.initialValue);
  }, [props.initialValue]);

  const componentProps:InputProps = {
    ...props
  }
  return <Input {...componentProps}
                onChange={(evt)=>setCurrentText(evt.target.value)}
                value={currentText}
  />
}