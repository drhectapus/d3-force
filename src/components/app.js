import React, { Component } from 'react';
import * as d3 from 'd3';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nodes: [],
      links: []
    };
    this.fetchData();
    this.createForceGraph = this.createForceGraph.bind(this);
  }

  fetchData() {
    const API = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';

    d3.json(API, (error, data) => {
      if (error) throw error;

      this.setState({
        nodes: data.nodes,
        links: data.links
      }, this.createForceGraph);
    });
  }

  createForceGraph() {
    const { nodes, links } = this.state;
    console.log(nodes);
    console.log(links);

    const w = 900;
    const h = 550;
    const radius = 9;

    const margin = {
      top: 30,
      right: 30,
      bottom: 80,
      left: 80
    };

    const flagNodes = d3.select('.chart')
                        .append('div')
                        .attr('class', 'flag-nodes');

    const svg = d3.select('.chart')
                  .append('svg')
                  .attr('width', w)
                  .attr('height', h);

    const div = d3.select('.chart')
                  .append('div')
                  .attr('class', 'tooltip')
                  .style('opacity', 0);

    const simulation = d3.forceSimulation()
                         .force('link', d3.forceLink().id(function(d, i) { return i }).distance(50))
                         .force('charge', d3.forceManyBody().strength(-30).distanceMax(50).distanceMin(20))
                         .force('center', d3.forceCenter(w / 2, h / 2))
                         .force('collision', d3.forceCollide().radius(16).strength(1));

    const link = svg.append('g')
                    .attr('class', 'links')
                    .selectAll('line')
                    .data(links)
                    .enter()
                    .append('line')


    simulation.nodes(nodes)
              .on('tick', ticked);

    simulation.force('link')
              .links(links);

    let node = flagNodes.selectAll('.flag-nodes')
                        .data(nodes)
                        .enter()
                        .append('div')
                        .attr('class', d => {
                          return `flag flag-${d.code}`;
                        })
                        .call(d3.drag()
                                .on('start', dragstarted)
                                .on('drag', dragged)
                                .on('end', dragended))
                        .on('mouseover', function(d) {

                          div.style('opacity', 0.9)
                             .html(`<strong>${d.country}</strong>`)
                             .style('left', `${d3.event.pageX}px`)
                             .style('top', `${d3.event.pageY}px`)
                        })
                        .on('mouseout', function(d) {
                          div.style('opacity', 0);
                        });

    function ticked() {
       link
           .attr("x1", function(d) { return d.source.x; })
           .attr("y1", function(d) { return d.source.y; })
           .attr("x2", function(d) { return d.target.x; })
           .attr("y2", function(d) { return d.target.y; });

       node
           .style("left", function(d) {
             let xlimit = Math.max(radius, Math.min(w - radius, d.x))
             return (xlimit) + 'px'
           })
           .style("top", function(d) {
             let ylimit = Math.max(radius, Math.min(h - radius, d.y))
             return (ylimit - 2) + 'px'
           });
    }


    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }

  render() {
    return(
      <div>
        <h1 className='title'>D3 Force-Directed Layout</h1>
        <div className='chart'>
        </div>
      </div>
    )
  }
}
