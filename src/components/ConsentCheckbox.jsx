export default function ConsentCheckbox({ checked, onChange, id, children }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-left">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-steel accent-cobalt"
      />
      <span className="text-xs leading-relaxed text-dim">{children}</span>
    </label>
  )
}
