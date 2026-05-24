import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from './dialog';
import { Button } from './button';

/**
 * Modal — thin wrapper around Dialog.
 * @param {boolean} open
 * @param {() => void} onClose
 * @param {string} title
 * @param {string} description
 * @param {React.ReactNode} children
 * @param {React.ReactNode} footer — custom footer, defaults to a close button
 * @param {string} className — extra classes on DialogContent
 */
export function Modal({ open, onClose, title, description, children, footer, className }) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose?.(); }}>
      <DialogContent className={className}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
        {footer !== undefined ? (
          footer && <DialogFooter>{footer}</DialogFooter>
        ) : (
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={onClose}>Cerrar</Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
