import CallButton from './CallButton'

export default function StickyCallBar({ onCallClick, isNight }) {
  return (
    <div className="sticky-mobile-call">
      <div className="mx-auto max-w-lg">
        <CallButton
          size="sm"
          label={isNight ? 'CHIAMA — NOTTE' : 'CHIAMA ORA'}
          onCallClick={onCallClick}
          showNumber={false}
        />
      </div>
    </div>
  )
}
