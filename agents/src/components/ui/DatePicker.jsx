import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

/**
 * DatePicker — single date selection.
 * @param {Date} value
 * @param {(date: Date) => void} onChange
 * @param {string} placeholder
 * @param {string} className
 */
export function DatePicker({ value, onChange, placeholder = 'Seleccioná una fecha', className }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground', className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'dd/MM/yyyy', { locale: es }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          locale={es}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

/**
 * DateRangePicker — date range selection.
 * @param {{ from: Date, to: Date }} value
 * @param {(range: { from: Date, to: Date }) => void} onChange
 */
export function DateRangePicker({ value, onChange, placeholder = 'Seleccioná un rango', className }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start text-left font-normal', !value?.from && 'text-muted-foreground', className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, 'dd/MM/yyyy', { locale: es })} –{' '}
                {format(value.to, 'dd/MM/yyyy', { locale: es })}
              </>
            ) : (
              format(value.from, 'dd/MM/yyyy', { locale: es })
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          locale={es}
          numberOfMonths={2}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
