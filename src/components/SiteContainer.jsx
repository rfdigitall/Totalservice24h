export default function SiteContainer({ children, className = '', as: Tag = 'div' }) {
  return (
    <Tag className={`site-container ${className}`}>
      {children}
    </Tag>
  )
}
