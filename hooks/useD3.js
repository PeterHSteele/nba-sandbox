import { useRef, useEffect } from 'react'
import * as d3 from 'd3'

export const useD3 = (renderChartFunction, dependencies) => {
  const ref = useRef()

  useEffect(()=>{
    renderChartFunction(d3.select(ref.current))
  }, dependencies)
  
  return ref
}