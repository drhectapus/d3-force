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

    const w = 800;
    const h = 500;

    const margin = {
      top: 30,
      right: 30,
      bottom: 80,
      left: 80
    };

    const svg = d3.select('.chart')
                  .append('svg')
                  .attr('width', w)
                  .attr('height', h);

    const simulation = d3.forceSimulation()
                         .force('link', d3.forceLink().id(function(d, i) { return i }).distance(1))
                         .force('charge', d3.forceManyBody().strength(1))
                         .force('center', d3.forceCenter(w / 2, h / 2))
                         .force('collision', d3.forceCollide(12));

    const link = svg.append('g')
                    .attr('class', 'links')
                    .selectAll('line')
                    .data(links)
                    .enter()
                    .append('line')
                    .attr('stroke', 'black');

    const node = d3.select('.nodes')
                    .selectAll('img')
                    .data(nodes)
                    .enter()
                    .append('img')
                    .attr('class', d => {
                      return `flag flag-${d.code}`;
                    })
                    .call(d3.drag()
                            .on('start', dragstarted)
                            .on('drag', dragged)
                            .on('end', dragended));

    simulation.nodes(nodes)
              .on('tick', ticked);

    simulation.force('link')
              .links(links);

    function ticked() {
       link
           .attr("x1", function(d) { return d.source.x; })
           .attr("y1", function(d) { return d.source.y; })
           .attr("x2", function(d) { return d.target.x; })
           .attr("y2", function(d) { return d.target.y; });

       node
           .style("left", function(d) { return d.x + 'px'; })
           .style("top", function(d) { return d.y + 'px'; });
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
      <div>D3 Force-Directed Layout
        <div className='chart'>
          <div className='nodes'></div>
        </div>
      </div>
    )
  }
}
