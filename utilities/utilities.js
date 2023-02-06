const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

const printDate = dateString => {
  if ( !dateString ){
    return ''
  }

  const date = new Date( dateString )
  let printed = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()
  return printed;
}

const printDateShort = dateString => {
  const date = new Date( dateString )
  return date.getMonth()+1 + '/' + date.getDate() + '/' + date.getFullYear().toString().slice(2)
}

export { printDate, printDateShort, months };