import { useState } from 'react';
import { Switch } from '@headlessui/react';

interface Props {
  label: string;
  checked: boolean;
  toggle(value: boolean): void;
}

function Toggle({ label, checked, toggle }: Props) {
  return (
    <Switch.Group>
      <div className="flex w-full items-center px-4 py-2 font-bold">
        {label ? <Switch.Label className="mr-4">{label}</Switch.Label> : null}
        <Switch
          checked={checked}
          onChange={toggle}
          className={`${
            checked ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-1 w-11 items-center rounded-full transition-colors outline-none`}
        >
          <span
            className={`${
              checked ? 'translate-x-7' : 'translate-x-0'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform border border-gray-300`}
          />
        </Switch>
      </div>
    </Switch.Group>
  );
}

export default Toggle;
