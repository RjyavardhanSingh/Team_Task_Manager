import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

const maxWidthBySize = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
};

export const Modal = ({ isOpen, title, description, onClose, children, footer, size = 'md' }) => {
    if (!isOpen || typeof document === 'undefined') return null;

    return createPortal(
        <div className="overlay-enter fixed inset-0 z-40 flex items-center justify-center bg-black/35 px-4 py-8">
            <div className={cn('modal-enter w-full rounded-none border border-zinc-300 bg-white', maxWidthBySize[size] || 'max-w-xl')}>
                <div className="flex items-start justify-between border-b border-zinc-300 bg-zinc-50 px-4 py-3">
                    <div>
                        <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
                        {description ? <p className="mt-1 text-sm text-zinc-600">{description}</p> : null}
                    </div>
                    <button type="button" onClick={onClose} className="field-control p-1 hover:bg-zinc-100" aria-label="Close modal">
                        <X size={14} />
                    </button>
                </div>

                <div className="px-4 py-4">{children}</div>

                {footer ? <div className="border-t border-zinc-300 bg-zinc-50 px-4 py-3">{footer}</div> : null}
            </div>
        </div>,
        document.body
    );
};
