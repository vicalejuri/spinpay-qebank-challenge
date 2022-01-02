import { memo, ReactElement, useState } from 'react';

import { Root as Label } from '@radix-ui/react-label';
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';

import styles from './Input.module.css';
import { cn } from '$lib/utils';

export interface InputProps {
  id: string;
  className?: string | string[];
  name: string;
  label: string;
  defaultValue?: string | number;
  prefix?: ReactElement;
  suffix?: ReactElement;

  /** Validation */
  rules?: Array<(value: InputProps['defaultValue']) => true | string>;

  /**  type=number customization  */
  type?: string;
  min?: number;
  step?: number;

  placeholder?: string;
}

const InputLabel = memo(({ id, label }: Pick<InputProps, 'id' | 'label'>) => {
  return (
    <Label htmlFor={id} className={styles.label}>
      {label}
    </Label>
  );
});

const Input = ({
  className,
  id,
  name,
  label,
  prefix,
  suffix,
  defaultValue = '',
  type = 'text',
  rules = [],
  placeholder = '',
  min = 0,
  step = 0.01
}: InputProps) => {
  const [value, setValue] = useState(defaultValue);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (rules) {
      const errors = rules
        .map((rule) => rule(newValue))
        .filter((error) => error !== true)
        .map((error) => String(error));

      setErrorMessage(errors.length ? errors[0] : '');
    }
  };

  return (
    <div className={cn(styles.wrapper, className)}>
      <InputLabel id={id} label={label} />
      <Popover open={errorMessage !== ''}>
        <PopoverTrigger asChild>
          <div className={styles.inputWrapper} data-invalid={errorMessage !== ''}>
            {prefix}
            <input
              id={id}
              type={type}
              name={name}
              className={styles.inputElement}
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              {...(type === 'number' && {
                min,
                step
              })}
            />
            {suffix}
          </div>
        </PopoverTrigger>
        <PopoverContent className={styles.errorMessage} sideOffset={4}>
          <PopoverArrow fill={'var(--surface1)'} />
          {errorMessage}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Input;
