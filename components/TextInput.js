export default function TextInput ({handleChange, value, placeholder, style, id }){
  return( 
    <input 
    className={style} 
    placeholder={placeholder} 
    type="text" 
    id={id} //last-name-input
    onChange={handleChange} 
    value={value} />
  )
 }