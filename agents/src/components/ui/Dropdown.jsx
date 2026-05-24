import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from './select';

/**
 * Dropdown — thin wrapper around Shadcn Select.
 *
 * @param {string} value — current value
 * @param {(value: string) => void} onChange
 * @param {{ value: string, label: string, group?: string }[]} options
 * @param {string} placeholder
 * @param {boolean} disabled
 * @param {string} className
 *
 * Usage:
 *   <Dropdown
 *     value={status}
 *     onChange={setStatus}
 *     options={[{ value: 'active', label: 'Activo' }, { value: 'inactive', label: 'Inactivo' }]}
 *     placeholder="Seleccioná un estado"
 *   />
 */
export function Dropdown({ value, onChange, options = [], placeholder, disabled, className }) {
  const grouped = options.some((o) => o.group);

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {grouped
          ? Object.entries(
              options.reduce((acc, o) => {
                const g = o.group || '';
                if (!acc[g]) acc[g] = [];
                acc[g].push(o);
                return acc;
              }, {})
            ).map(([group, items]) => (
              <SelectGroup key={group}>
                {group && <SelectLabel>{group}</SelectLabel>}
                {items.map((o) => (
                  <SelectItem key={o.value} value={o.value} disabled={o.disabled}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))
          : options.map((o) => (
              <SelectItem key={o.value} value={o.value} disabled={o.disabled}>
                {o.label}
              </SelectItem>
            ))}
      </SelectContent>
    </Select>
  );
}
