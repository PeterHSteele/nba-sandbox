import * as d3 from 'd3'
import { useD3 } from '../hooks/useD3'
import { printDateShort } from '../utilities/utilities'

const renderChartFunction = games => {
  return svg => {
    const height = 500
    const width = 1000
    const margin = { top: 40, right: 30, bottom: 30, left: 40 }
    games = games.filter(game=>game.plusMinus)
    const lightblue = '#93d3f6',
    blue = '#203db9'
    

    const x = d3
      .scaleBand()
      .domain( games.map(game=>game.game.id) )
      .rangeRound([margin.left, width-margin.right])
      .padding( .1 )

    //console.log(games.map(game=>game.plusMinus))
    //console.log('teams',games[12].teams)

    const scoreDiffs = games.map( game => {
      
      let { teams } = game ;
      
      if (! teams ){
        //console.log('no teams')
        return 0
      }
      
      let  { home, visitors } =  teams 
      if ( !home || !visitors ){
        //console.log('no home/away')
        return 0
      }

      let isHome = game.team.code == home.code
      let scoreDiff = game.scores.home.points - game.scores.visitors.points
      if (!isHome) scoreDiff = -1 * scoreDiff
      return scoreDiff
    })

    //console.log({scoreDiffs})

    //min & max for +/-
    const playerMin = d3.min( games.map(game=>1*game.plusMinus) ),
    playerMax = d3.max( games.map(game => 1*game.plusMinus) ),
    playerRange = playerMax - playerMin

    //min & max for team margin of victory
    const teamMax = d3.max(scoreDiffs),
    teamMin = d3.min(scoreDiffs),
    teamRange = teamMax - teamMin

    //overall max and min to set range of graph
    const max = d3.max([playerMax, teamMax]),
    min = d3.min([playerMin, teamMin]),
    range = max - min

    const y = d3.scaleLinear(
      [ min, max ],
      [ height - margin.bottom, margin.top ]
    )

    //console.log('heights',height - margin.bottom, margin.top)

    const heightScale = d3.scaleLinear([0,range],[ height - margin.bottom, margin.top])

    //console.log('heightscaleTest', heightScale(41))

    const xAxis = g => {
      g.attr('transform', `translate(0,${height - margin.bottom})`).call(
        d3.axisBottom(x)
          .tickArguments([20, 's'])
          .tickSizeOuter(0)
      )
      .selectAll('text')
        .style('display', 'none')
        .attr('transform','rotate(90) translate(20,-12)')
    }

    const yAxis = g => {
      g
        .attr('transform', `translate(${margin.left},0)`)
        .call(
          d3.axisLeft(y).ticks(null,'s')
        )
        .call(g=>g.select(".domain").remove())
        .call(g=>{
          g
            .append('text')
            .attr('x', -margin.left)
            .attr('y', 10)
            .attr('fill', "currentColor")
            .attr('text-anchor', 'start')
            .text('plus minus')
        })
    }

    svg.select(".x-axis").call(xAxis)
    svg.select(".y-axis").call(yAxis)

    const data = svg
      .select(".plot-area")
      //.attr("fill", "steelblue")
      .selectAll(".bar")
      .data(games)
      .enter()

    data
      .append('rect')
      .attr('class', 'bar')
      .attr('x',game => {
        //console.log(game.game.id)
        let xPos = x(game.game.id)
        //console.log({xPos})
        return xPos
      })
      .attr('width', x.bandwidth())
      .attr('y', game => {
        let zeroVal = y(0);
        let yVal = y(game.plusMinus)
        //console.log({yVal})
        
        if (game.plusMinus<0){
          return zeroVal;
        } else {
          return zeroVal - (height - margin.bottom - heightScale(1*game.plusMinus))
        }
      })
      .attr('height', game => {
        //console.log( 'height', Math.abs(y(game.plusMinus)))
        return height - margin.bottom - heightScale(Math.abs(1*game.plusMinus))
      })
      .attr('fill', lightblue)
      .append('title')
        .text( game => game.game.id + ': ' + game.plusMinus )

    data
      .append('circle')
      .attr('class', 'circle')
      .attr('r', 3*x.bandwidth()/8)
      .attr('cx', game => x(game.game.id) + x.bandwidth()/2)
      .attr('cy', (game,index) => {
        const zeroVal = y(0),
        diff = scoreDiffs[index]
        return zeroVal - ( height - margin.bottom - heightScale(scoreDiffs[index]) )
      })
      .attr('fill', blue)
      .append('title')
        .text( (game,index) => printDateShort(game.date?.start) + ' - ' + game.teams?.home.code + ' vs ' + game.teams?.visitors.code +': '+scoreDiffs[index] )

    /* =============
    Legend
    ============== */

    const { player } = games[0],
    offsetY = 15,
    fontsize = 12,
    legendItems = [
      {
        text: player.firstname + ' ' + player.lastname + "'s plus/minus",
        shape: 'rect',
        fill: lightblue,
        height: 10,
        width: x.bandwidth(),
      },
      {
        text: 'Team margin of victory/defeat',
        shape: 'circle',
        fill: blue,
        radius: 3 * x.bandwidth() / 8,
      }
    ]

    const legend = svg
      .select('.legend')
      .attr('transform', `translate(${margin.left}, ${height})`)

    legendItems.forEach( (item, index) => {
      legend
        .append( 'text' )
        .text( item.text )
        .attr( 'y', offsetY * index )
        .attr( 'x', x.bandwidth() + 10 )
        .style( 'font-size', fontsize )

      if ( 'rect' == item.shape ){
        legend
          .append( item.shape )
          .attr( 'height', item.height )
          .attr( 'width', item.width )
          .attr( 'y', offsetY * index - item.height )
          .attr( 'fill', item.fill )
      } 

      if ( 'circle' == item.shape ){
        legend
          .append( item.shape )
          .attr( 'r', item.radius )
          .attr( 'cy', offsetY * index - item.radius )
          .attr( 'cx', item.radius )
          .attr( 'fill', item.fill )
      }
    })
      
  }
}

const Graph = ({ games }) => {
  
  const ref = useD3(
    renderChartFunction(games)
  )

  return (
    <svg
    ref={ref}
    style={{
      height: 550, //500 + margin.top + margin.bottom
      width: 1070  //1000 + margin.left + margin.right
    }}
    >
      <text y={20} x={255}>Player Plus/Minus Relative to Team Margin of Victory, '21-'22 Season</text>
      <g className='x-axis' />
      <g className='y-axis' />
      <g className='plot-area' />
      <g className='legend' /> 
    </svg>
  )
}

export default Graph