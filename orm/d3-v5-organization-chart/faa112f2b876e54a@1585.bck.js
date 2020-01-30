// https://observablehq.com/@bumbeishvili/d3-v5-organization-chart@1585
import define1 from "./75ef0cd619f34b42@491.js";
import define2 from "./e93997d5089d7165@2223.js";

export default function define(runtime, observer) {
    const main = runtime.module();
    main.variable(observer()).define(["md", "html"], function (md, html) {
        return (
            md`# d3.v5 Org  Chart 

${(navigator.userAgent.match('HeadlessChrome')) ? html`<img src="https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/tree-thumbnail.png">` : ''}

`
        )
    });
    main.variable(observer()).define(["html"], function (html) {
        return (
            html`

<table>

<tr>
<th colspan=20 >DESKTOP SUPPORT</th>
</tr>

<tr>
<th colspan=4 >Mac os</th>
<th  colspan=8>Windows</th>
</tr>



<tr>
<th>Chrome</th>
<th>Firefox</th>
<th>Safari</th>
<th>Opera</th>

<th>Chrome</th>
<th>Firefox</th>
<th>Edge</th>
<th>Opera</th>
<th>IE8</th>
<th>IE9</th>
<th>IE10</th>
<th>IE11</th>
</tr>


<tr>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>


<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>?</td>
<td>?</td>
<td>?</td>
<td>?</td>

</tr>

<tr>
<td>&nbsp;</td>
</tr>
<tr>
<th colspan=20 >MOBILE SUPPORT</th>
</tr>

<tr>
<th colspan=1 >ANDROID</th>
<th colspan=2 >IOS</th>
</tr>

</tr>
<th>Chrome</th>
<th>Chrome</th>
<th>Safari</th>
<tr>


<tr>
<td>yes</td>
<td>yes</td>
<td>yes</td>
</tr>

</table>

 <br> <br> 
This org chart is  <br> 
✓ Zoomable  - programmable and manual zoom  <br> 
✓ Draggable - manual dragging <br>
✓ Collapsible  - expand collapse nodes <br>
✓ Updatable &nbsp;  - add or remove nodes at runtime <br>

 <br>


`
        )
    });
    main.variable(observer("viewof expandBtn")).define("viewof expandBtn", ["button"], function (button) {
        return (
            button('expand node with id O-111')
        )
    });
    main.variable(observer("expandBtn")).define("expandBtn", ["Generators", "viewof expandBtn"], (G, _) => G.input(_));
    main.variable(observer("viewof collapseBtn")).define("viewof collapseBtn", ["button"], function (button) {
        return (
            button('collapse node  with id O-111')
        )
    });
    main.variable(observer("collapseBtn")).define("collapseBtn", ["Generators", "viewof collapseBtn"], (G, _) => G.input(_));
    main.variable(observer("viewof addBtn")).define("viewof addBtn", ["button"], function (button) {
        return (
            button(`add node as root's child`)
        )
    });
    main.variable(observer("addBtn")).define("addBtn", ["Generators", "viewof addBtn"], (G, _) => G.input(_));
    main.variable(observer("viewof addBtnG")).define("viewof addBtnG", ["button"], function (button) {
        return (
            button(`add node as first child's  child`)
        )
    });
    main.variable(observer("addBtnG")).define("addBtnG", ["Generators", "viewof addBtnG"], (G, _) => G.input(_));
    main.variable(observer("viewof removeBtn")).define("viewof removeBtn", ["button"], function (button) {
        return (
            button(`remove node id="0-5"`)
        )
    });
    main.variable(observer("removeBtn")).define("removeBtn", ["Generators", "viewof removeBtn"], (G, _) => G.input(_));
    main.variable(observer("viewof removeGrandChildBtn")).define("viewof removeGrandChildBtn", ["button"], function (button) {
        return (
            button(`remove node  id="0-6"`)
        )
    });
    main.variable(observer("removeGrandChildBtn")).define("removeGrandChildBtn", ["Generators", "viewof removeGrandChildBtn"], (G, _) => G.input(_));
    main.variable(observer("viewof zoom")).define("viewof zoom", ["slider"], function (slider) {
        return (
            slider({title: "Initial zoom", min: 0.1, value: 0.6, max: 2})
        )
    });
    main.variable(observer("zoom")).define("zoom", ["Generators", "viewof zoom"], (G, _) => G.input(_));
    main.variable(observer("container")).define("container", ["Chart", "html", "width"], function* (Chart, html, width) {
            Chart;
            yield html`<div class="chart-container" style=" padding-top:10px; width:${width}px; height:600px "> </div>`
        }
    );
    main.variable(observer()).define(["md"], function (md) {
        return (
            md`Data has a flat format and it can be inspected just one cell bellow`
        )
    });
    main.variable(observer("data")).define("data", ["dataFlattened"], function (dataFlattened) {
        return (
            dataFlattened.map(d => {
                const width = Math.round(Math.random() * 50 + 300);
                const height = Math.round(Math.random() * 20 + 130);
                const cornerShape = ['ORIGINAL', 'ROUNDED', 'CIRCLE'][Math.round(Math.random() * 2)];
                const nodeImageWidth = 100;
                const nodeImageHeight = 100;
                const centerTopDistance = 0;
                const centerLeftDistance = 0;
                const expanded = false; //d.id=="O-6"

                const titleMarginLeft = nodeImageWidth / 2 + 20 + centerLeftDistance;
                const contentMarginLeft = width / 2 + 25;
                return {
                    nodeId: d.id,
                    parentNodeId: d.parentId,
                    width: width,
                    height: height * Math.round(Math.random() * 2),
                    borderWidth: 1,
                    borderRadius: 15,
                    borderColor: {
                        red: 15,
                        green: 140,
                        blue: 121,
                        alpha: 1,
                    },
                    backgroundColor: {
                        red: 0,
                        green: 81,
                        blue: 90,
                        alpha: 1,
                    },
                    nodeImage: {
                        url: d.imageUrl,
                        width: nodeImageWidth,
                        height: nodeImageHeight,
                        centerTopDistance: centerTopDistance,
                        centerLeftDistance: centerLeftDistance,
                        cornerShape: cornerShape,
                        shadow: false,
                        borderWidth: 0,
                        borderColor: {
                            red: 19,
                            green: 123,
                            blue: 128,
                            alpha: 1,
                        },
                    },
                    template: `<div>
                  <div style="margin-left:${titleMarginLeft}px;
                              margin-top:10px;
                              font-size:20px;
                              font-weight:bold;
                         ">${d.name} </div>
                 <div style="margin-left:${titleMarginLeft}px;
                              margin-top:3px;
                              font-size:16px;
                         ">${d.positionName}  </div>
                 <div style="margin-left:${titleMarginLeft}px;
                              margin-top:3px;
                              font-size:16px;
                         ">${d.positionName}  </div>

                 <div style="margin-left:${titleMarginLeft}px;
                              margin-top:3px;
                              font-size:14px;
                         ">${d.unit.value}</div>

                 <div style="margin-left:${contentMarginLeft}px;
                             margin-top:15px;
                             font-size:13px;
                             position:absolute;
                             bottom:5px;
                            ">
                      <div>${d.office}</div>
                      <div style="margin-top:5px">${d.area}</div>
                 </div>
              </div>`,
                    connectorLineColor: {
                        red: 11,
                        green: 123,
                        blue: 108,
                        alpha: 1
                    },
                    connectorLineWidth: 5,
                    dashArray: '',
                    expanded: expanded
                }
            })
        )
    });
    main.variable(observer()).define(["md"], function (md) {
        return (
            md`We are instantiating visuals bellow, container can be raw html element (our case) or css selector, it gets wrapped using \`d3.select\`

You can inspect data just above this snippet (data must be array of objects)

`
        )
    });
    main.variable(observer("chart")).define("chart", ["Chart"], function (Chart) {
        return (
            new Chart()
        )
    });
    main.variable(observer("chartRendering")).define("chartRendering", ["chart", "container", "data", "width"], function (chart, container, data, width) {
            chart
                .container(container)
                .data(data)
                .svgWidth(width)
                .onNodeClick(d => console.log(d + ' node clicked'))
                .render()

        }
    );
    main.variable(observer()).define(["md"], function (md) {
        return (
            md`Function bellow is responsible for chart drawing`
        )
    });
    main.variable(observer("Chart")).define("Chart", ["d3", "DOM"], function (d3, DOM) {
        return (
            class Chart {
                constructor() {
                    // Exposed variables
                    const attrs = {
                        id: `ID${Math.floor(Math.random() * 1000000)}`, // Id for event handlings
                        svgWidth: 800,
                        svgHeight: 600,
                        marginTop: 0,
                        marginBottom: 0,
                        marginRight: 0,
                        marginLeft: 0,
                        container: 'body',
                        defaultTextFill: '#00193A',
                        nodeTextFill: '#E9DEC9',
                        defaultFont: 'Helvetica',
                        backgroundColor: '#E5D7BB',
                        data: null,
                        depth: 180,
                        duration: 600,
                        strokeWidth: 3,
                        dropShadowId: null,
                        initialZoom: 1,
                        onNodeClick: d => d,
                        hideSubordinates: true
                    };

                    this.getChartState = () => attrs;

                    // Dinamically set getter and setter functions for Chart class
                    Object.keys(attrs).forEach((key) => {
                        //@ts-ignore
                        this[key] = function (_) {
                            var string = `attrs['${key}'] = _`;
                            if (!arguments.length) {
                                return eval(`attrs['${key}'];`);
                            }
                            eval(string);
                            return this;
                        };
                    });


                    this.initializeEnterExitUpdatePattern();
                }

                initializeEnterExitUpdatePattern() {
                    d3.selection.prototype.patternify = function (params) {
                        var container = this;
                        var selector = params.selector;
                        var elementTag = params.tag;
                        var data = params.data || [selector];

                        // Pattern in action
                        var selection = container.selectAll('.' + selector).data(data, (d, i) => {
                            if (typeof d === 'object') {
                                if (d.id) {
                                    return d.id;
                                }
                            }
                            return i;
                        });
                        selection.exit().remove();
                        selection = selection.enter().append(elementTag).merge(selection);
                        selection.attr('class', selector);
                        return selection;
                    };
                }

                // This method retrieves passed node's children ID's (including node)
                getNodeChildrenIds({
                                       data,
                                       children,
                                       _children
                                   }, nodeIdsStore) {

                    // Store current node ID
                    nodeIdsStore.push(data.nodeId);

                    // Loop over children and recursively store descendants id (expanded nodes)
                    if (children) {
                        children.forEach(d => {
                            this.getNodeChildrenIds(d, nodeIdsStore)
                        })
                    }

                    // Loop over _children and recursively store descendants id (collapsed nodes)
                    if (_children) {
                        _children.forEach(d => {
                            this.getNodeChildrenIds(d, nodeIdsStore)
                        })
                    }

                    // Return result
                    return nodeIdsStore;
                }

                // This method can be invoked via chart.setZoomFactor API, it zooms to particulat scale
                setZoomFactor(zoomLevel) {
                    const attrs = this.getChartState();
                    const calc = attrs.calc;

                    // Store passed zoom level
                    attrs.initialZoom = zoomLevel;

                    // Rescale container element accordingly
                    attrs.centerG.attr('transform', ` translate(${calc.centerX}, ${calc.nodeMaxHeight / 2}) scale(${attrs.initialZoom})`)
                }

                render() {
                    //InnerFunctions which will update visuals

                    const attrs = this.getChartState();
                    const thisObjRef = this;

                    //Drawing containers
                    const container = d3.select(attrs.container);
                    const containerRect = container.node().getBoundingClientRect();
                    if (containerRect.width > 0) attrs.svgWidth = containerRect.width;

                    //Attach drop shadow id to attrs object
                    this.setDropShadowId(attrs);

                    //Calculated properties
                    const calc = {
                        id: null,
                        chartTopMargin: null,
                        chartLeftMargin: null,
                        chartWidth: null,
                        chartHeight: null
                    };
                    calc.id = `ID${Math.floor(Math.random() * 1000000)}`; // id for event handlings
                    calc.chartLeftMargin = attrs.marginLeft;
                    calc.chartTopMargin = attrs.marginTop;
                    calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
                    calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
                    attrs.calc = calc;

                    // Get maximum node width and height
                    calc.nodeMaxWidth = d3.max(attrs.data, ({
                                                                width
                                                            }) => width);
                    calc.nodeMaxHeight = d3.max(attrs.data, ({
                                                                 height
                                                             }) => height);

                    // Calculate max node depth (it's needed for layout heights calculation)
                    attrs.depth = calc.nodeMaxHeight + 100;
                    calc.centerX = calc.chartWidth / 2;

                    //********************  LAYOUTS  ***********************
                    const layouts = {
                        treemap: null
                    }
                    attrs.layouts = layouts;

                    // Generate tree layout function
                    layouts.treemap = d3.tree().size([calc.chartWidth, calc.chartHeight])
                        .nodeSize([calc.nodeMaxWidth + 100, calc.nodeMaxHeight + attrs.depth])

                    // ******************* BEHAVIORS . **********************
                    const behaviors = {
                        zoom: null
                    }

                    // Get zooming function
                    behaviors.zoom = d3.zoom().on("zoom", d => this.zoomed(d))

                    //****************** ROOT node work ************************

                    // Convert flat data to hierarchical
                    attrs.root = d3.stratify()
                        .id(({
                                 nodeId
                             }) => nodeId)
                        .parentId(({
                                       parentNodeId
                                   }) => parentNodeId)
                        (attrs.data)

                    // Set child nodes enter appearance positions
                    attrs.root.x0 = 0;
                    attrs.root.y0 = 0;

                    /** Get all nodes as array (with extended parent & children properties set)
                     This way we can access any node's parent directly using node.parent - pretty cool, huh?
                     */
                    attrs.allNodes = attrs.layouts.treemap(attrs.root).descendants()

                    // Assign direct children and total subordinate children's cound
                    attrs.allNodes.forEach(d => {
                        Object.assign(d.data, {
                            directSubordinates: d.children ? d.children.length : 0,
                            totalSubordinates: d.descendants().length - 1
                        })
                    })

                    // Collapse all children at first
                    attrs.root.children.forEach(d => this.collapse(d));

                    // Then expand some nodes, which have `expanded` property set
                    attrs.root.children.forEach(d => this.expandSomeNodes(d));

                    // *************************  DRAWING **************************
                    //Add svg
                    const svg = container
                        .patternify({
                            tag: 'svg',
                            selector: 'svg-chart-container'
                        })
                        .attr('width', attrs.svgWidth)
                        .attr('height', attrs.svgHeight)
                        .attr('font-family', attrs.defaultFont)
                        .call(behaviors.zoom)
                        .attr('cursor', 'move')
                        .style('background-color', attrs.backgroundColor);
                    attrs.svg = svg;

                    //Add container g element
                    const chart = svg
                        .patternify({
                            tag: 'g',
                            selector: 'chart'
                        })
                        .attr('transform', `translate(${calc.chartLeftMargin},${calc.chartTopMargin})`);

                    // Add one more container g element, for better positioning controls
                    attrs.centerG = chart.patternify({
                        tag: 'g',
                        selector: 'center-group'
                    })
                        .attr('transform', `translate(${calc.centerX},${calc.nodeMaxHeight / 2}) scale(${attrs.initialZoom})`);

                    attrs.chart = chart;

                    // ************************** ROUNDED AND SHADOW IMAGE  WORK USING SVG FILTERS **********************

                    //Adding defs element for rounded image
                    attrs.defs = svg.patternify({
                        tag: 'defs',
                        selector: 'image-defs'
                    });

                    // Adding defs element for image's shadow
                    const filterDefs = svg.patternify({
                        tag: 'defs',
                        selector: 'filter-defs'
                    });

                    // Adding shadow element - (play with svg filter here - https://bit.ly/2HwnfyL)
                    const filter = filterDefs.patternify({
                        tag: 'filter',
                        selector: 'shadow-filter-element'
                    })
                        .attr('id', attrs.dropShadowId)
                        .attr('y', `${-50}%`)
                        .attr('x', `${-50}%`)
                        .attr('height', `${200}%`)
                        .attr('width', `${200}%`);

                    // Add gaussian blur element for shadows - we can control shadow length with this
                    filter.patternify({
                        tag: 'feGaussianBlur',
                        selector: 'feGaussianBlur-element'
                    })
                        .attr('in', 'SourceAlpha')
                        .attr('stdDeviation', 3.1)
                        .attr('result', 'blur');

                    // Add fe-offset element for shadows -  we can control shadow positions with it
                    filter.patternify({
                        tag: 'feOffset',
                        selector: 'feOffset-element'
                    })
                        .attr('in', 'blur')
                        .attr('result', 'offsetBlur')
                        .attr("dx", 4.28)
                        .attr("dy", 4.48)
                        .attr("x", 8)
                        .attr("y", 8)

                    // Add fe-flood element for shadows - we can control shadow color and opacity with this element
                    filter.patternify({
                        tag: 'feFlood',
                        selector: 'feFlood-element'
                    })
                        .attr("in", "offsetBlur")
                        .attr("flood-color", 'black')
                        .attr("flood-opacity", 0.3)
                        .attr("result", "offsetColor");

                    // Add feComposite element for shadows
                    filter.patternify({
                        tag: 'feComposite',
                        selector: 'feComposite-element'
                    })
                        .attr("in", "offsetColor")
                        .attr("in2", "offsetBlur")
                        .attr("operator", "in")
                        .attr("result", "offsetBlur");

                    // Add feMerge element for shadows
                    const feMerge = filter.patternify({
                        tag: 'feMerge',
                        selector: 'feMerge-element'
                    });

                    // Add feMergeNode element for shadows
                    feMerge.patternify({
                        tag: 'feMergeNode',
                        selector: 'feMergeNode-blur'
                    })
                        .attr('in', 'offsetBlur')

                    // Add another feMergeNode element for shadows
                    feMerge.patternify({
                        tag: 'feMergeNode',
                        selector: 'feMergeNode-graphic'
                    })
                        .attr('in', 'SourceGraphic')

                    // Display tree contenrs
                    this.update(attrs.root)


                    //#########################################  UTIL FUNCS ##################################
                    // This function restyles foreign object elements ()


                    d3.select(window).on(`resize.${attrs.id}`, () => {
                        const containerRect = container.node().getBoundingClientRect();
                        //  if (containerRect.width > 0) attrs.svgWidth = containerRect.width;
                        //	main();
                    });


                    return this;
                }

                // This function sets drop shadow ID to the passed object
                setDropShadowId(d) {

                    // If it's already set, then return
                    if (d.dropShadowId) return;

                    // Generate drop shadow ID
                    let id = `${d.id}-drop-shadow`;

                    // If DOM object is available, then use UID method to generated shadow id
                    //@ts-ignore
                    if (typeof DOM != 'undefined') {
                        //@ts-ignore
                        id = DOM.uid(d.id).id;
                    }

                    // Extend passed object with drop shadow ID
                    Object.assign(d, {
                        dropShadowId: id
                    })
                }


                // This function can be invoked via chart.addNode API, and it adds node in tree at runtime
                addNode(obj) {
                    const attrs = this.getChartState();
                    attrs.data.push(obj);

                    // Update state of nodes and redraw graph
                    this.updateNodesState();
                    return this;
                }

                // This function can be invoked via chart.removeNode API, and it removes node from tree at runtime
                removeNode(nodeId) {
                    const attrs = this.getChartState();
                    const node = attrs.allNodes.filter(({
                                                            data
                                                        }) => data.nodeId == nodeId)[0];


                    // Remove all node childs
                    if (node) {
                        // Retrieve all children nodes ids (including current node itself)
                        const nodeChildrenIds = this.getNodeChildrenIds(node, []);

                        // Filter out retrieved nodes and reassign data
                        attrs.data = attrs.data.filter(d => !nodeChildrenIds.includes(d.nodeId))

                        const updateNodesState = this.updateNodesState.bind(this);
                        // Update state of nodes and redraw graph
                        updateNodesState();
                    }
                }

                // This function basically redraws visible graph, based on nodes state
                update({
                           x0,
                           y0,
                           x,
                           y
                       }) {

                    const attrs = this.getChartState();
                    const calc = attrs.calc;

                    //  Assigns the x and y position for the nodes
                    const treeData = attrs.layouts.treemap(attrs.root);

                    // Get tree nodes and links and attach some properties
                    const nodes = treeData.descendants()
                        .map(d => {
                            // If at least one property is already set, then we don't want to reset other properties
                            if (d.width) return d;

                            // Declare properties with deffault values
                            let imageWidth = 100;
                            let imageHeight = 100;
                            let imageBorderColor = 'steelblue';
                            let imageBorderWidth = 0;
                            let imageRx = 0;
                            let imageCenterTopDistance = 0;
                            let imageCenterLeftDistance = 0;
                            let borderColor = 'steelblue';
                            let backgroundColor = 'steelblue';
                            let width = d.data.width;
                            let height = d.data.height;
                            let dropShadowId = `none`;

                            // Override default values based on data
                            if (d.data.nodeImage && d.data.nodeImage.shadow) {
                                dropShadowId = `url(#${attrs.dropShadowId})`
                            }
                            if (d.data.nodeImage && d.data.nodeImage.width) {
                                imageWidth = d.data.nodeImage.width
                            }
                            ;
                            if (d.data.nodeImage && d.data.nodeImage.height) {
                                imageHeight = d.data.nodeImage.height
                            }
                            ;
                            if (d.data.nodeImage && d.data.nodeImage.borderColor) {
                                imageBorderColor = this.rgbaObjToColor(d.data.nodeImage.borderColor)
                            }
                            ;
                            if (d.data.nodeImage && d.data.nodeImage.borderWidth) {
                                imageBorderWidth = d.data.nodeImage.borderWidth
                            }
                            ;
                            if (d.data.nodeImage && d.data.nodeImage.centerTopDistance) {
                                imageCenterTopDistance = d.data.nodeImage.centerTopDistance
                            }
                            ;
                            if (d.data.nodeImage && d.data.nodeImage.centerLeftDistance) {
                                imageCenterLeftDistance = d.data.nodeImage.centerLeftDistance
                            }
                            ;
                            if (d.data.borderColor) {
                                borderColor = this.rgbaObjToColor(d.data.borderColor);
                            }
                            if (d.data.backgroundColor) {
                                backgroundColor = this.rgbaObjToColor(d.data.backgroundColor);
                            }
                            if (d.data.nodeImage &&
                                d.data.nodeImage.cornerShape.toLowerCase() == "circle") {
                                imageRx = Math.max(imageWidth, imageHeight);
                            }
                            if (d.data.nodeImage &&
                                d.data.nodeImage.cornerShape.toLowerCase() == "rounded") {
                                imageRx = Math.min(imageWidth, imageHeight) / 6;
                            }

                            // Extend node object with calculated properties
                            return Object.assign(d, {
                                imageWidth,
                                imageHeight,
                                imageBorderColor,
                                imageBorderWidth,
                                borderColor,
                                backgroundColor,
                                imageRx,
                                width,
                                height,
                                imageCenterTopDistance,
                                imageCenterLeftDistance,
                                dropShadowId
                            });
                        });

                    // Get all links
                    const links = treeData.descendants().slice(1);

                    // Set constant depth for each nodes
                    nodes.forEach(d => d.y = d.depth * attrs.depth);

                    // ------------------- FILTERS ---------------------

                    // Add patterns for each node (it's needed for rounded image implementation)
                    const patternsSelection = attrs.defs.selectAll('.pattern')
                        .data(nodes, ({
                                          id
                                      }) => id);

                    // Define patterns enter selection
                    const patternEnterSelection = patternsSelection.enter().append('pattern')

                    // Patters update selection
                    const patterns = patternEnterSelection
                        .merge(patternsSelection)
                        .attr('class', 'pattern')
                        .attr('height', 1)
                        .attr('width', 1)
                        .attr('id', ({
                                         id
                                     }) => id)

                    // Add images to patterns
                    const patternImages = patterns.patternify({
                        tag: 'image',
                        selector: 'pattern-image',
                        data: d => [d]
                    })
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('height', ({
                                             imageWidth
                                         }) => imageWidth)
                        .attr('width', ({
                                            imageHeight
                                        }) => imageHeight)
                        .attr('xlink:href', ({
                                                 data
                                             }) => data.nodeImage.url)
                        .attr('viewbox', ({
                                              imageWidth,
                                              imageHeight
                                          }) => `0 0 ${imageWidth * 2} ${imageHeight}`)
                        .attr('preserveAspectRatio', 'xMidYMin slice')

                    // Remove patterns exit selection after animation
                    patternsSelection.exit().transition().duration(attrs.duration).remove();

                    // --------------------------  LINKS ----------------------
                    // Get links selection
                    const linkSelection = attrs.centerG.selectAll('path.link')
                        .data(links, ({
                                          id
                                      }) => id);

                    // Enter any new links at the parent's previous position.
                    const linkEnter = linkSelection.enter()
                        .insert('path', "g")
                        .attr("class", "link")
                        .attr('pointer-events', 'all')
                        .attr('d', d => {
                            const o = {
                                x: x0,
                                y: y0
                            };
                            return this.diagonal(o, o)
                        });

                    // Get links update selection
                    const linkUpdate = linkEnter.merge(linkSelection);

                    // Styling links
                    linkUpdate
                        .attr("fill", "none")
                        .attr("stroke-width", ({
                                                   data
                                               }) => data.connectorLineWidth || 2)
                        .attr('stroke', ({
                                             data
                                         }) => {
                            if (data.connectorLineColor) {
                                return this.rgbaObjToColor(data.connectorLineColor);
                            }
                            return 'green';
                        })
                        .attr('stroke-dasharray', ({
                                                       data
                                                   }) => {
                            if (data.dashArray) {
                                return data.dashArray;
                            }
                            return '';
                        })

                    // Transition back to the parent element position
                    linkUpdate.transition()
                        .duration(attrs.duration)
                        .attr('d', d => this.diagonal(d, d.parent));

                    // Remove any  links which is exiting after animation
                    const linkExit = linkSelection.exit()
                        .attr('pointer-events', 'none')
                        .transition()
                        .duration(attrs.duration)
                        .attr('d', d => {
                            const o = {
                                x: x,
                                y: y
                            };
                            return this.diagonal(o, o)
                        })
                        .remove();

                    // --------------------------  NODES ----------------------
                    // Get nodes selection
                    const nodesSelection = attrs.centerG.selectAll('g.node')
                        .data(nodes, ({
                                          id
                                      }) => id)

                    // Enter any new nodes at the parent's previous position.
                    const nodeEnter = nodesSelection.enter().append('g')
                        .attr('pointer-events', 'all')
                        .attr('class', 'node')
                        .attr("transform", d => `translate(${x0},${y0})`)
                        .attr('cursor', 'pointer')
                        .on('click', ({
                                          data
                                      }) => {
                            if ([...d3.event.srcElement.classList].includes('node-button-circle')) {
                                return;
                            }
                            attrs.onNodeClick(data.nodeId);
                        });

                    // Add background rectangle for the nodes
                    nodeEnter
                        .patternify({
                            tag: 'rect',
                            selector: 'node-rect',
                            data: d => [d]
                        })
                        .style("fill", ({
                                            _children
                                        }) => _children ? "lightsteelblue" : "#fff")


                    // Add node icon image inside node
                    nodeEnter
                        .patternify({
                            tag: 'image',
                            selector: 'node-icon-image',
                            data: d => []
                        })
                        .attr('width', ({
                                            data
                                        }) => data.nodeIcon.size)
                        .attr('height', ({
                                             data
                                         }) => data.nodeIcon.size)
                        .attr("xlink:href", ({
                                                 data
                                             }) => data.nodeIcon.icon)
                        .attr('x', ({
                                        width
                                    }) => -width / 2 + 5)
                        .attr('y', ({
                                        height,
                                        data
                                    }) => height / 2 - data.nodeIcon.size - 5)

                    // Add total descendants text
                    nodeEnter
                        .patternify({
                            tag: 'text',
                            selector: 'node-icon-text-total',
                            data: d => []
                        })
                        .text('test')
                        .attr('x', ({
                                        width
                                    }) => -width / 2 + 7)
                        .attr('y', ({
                                        height,
                                        data
                                    }) => height / 2 - data.nodeIcon.size - 5)
                        .text(({
                                   data
                               }) => `${data.totalSubordinates} Subordinates`)
                        .attr('fill', attrs.nodeTextFill)
                        .attr('font-weight', 'bold')
                        .attr('display', attrs.hideSubordinates ? 'none' : 'initial')

                    // Add direct descendants text
                    nodeEnter
                        .patternify({
                            tag: 'text',
                            selector: 'node-icon-text-direct',
                            data: d => []
                        })
                        .text('test')
                        .attr('x', ({
                                        width,
                                        data
                                    }) => -width / 2 + 10 + data.nodeIcon.size)
                        .attr('y', ({
                                        height
                                    }) => height / 2 - 10)
                        .text(({
                                   data
                               }) => `${data.directSubordinates} Direct `)
                        .attr('fill', attrs.nodeTextFill)
                        .attr('font-weight', 'bold')
                        .attr('display', attrs.hideSubordinates ? 'none' : 'initial')


                    // Defined node images wrapper group
                    const nodeImageGroups = nodeEnter.patternify({
                        tag: 'g',
                        selector: 'node-image-group',
                        data: d => [d]
                    })

                    // Add background rectangle for node image
                    nodeImageGroups
                        .patternify({
                            tag: 'rect',
                            selector: 'node-image-rect',
                            data: d => [d]
                        })


                    // Node update styles
                    const nodeUpdate = nodeEnter.merge(nodesSelection)
                        .style('font', '12px sans-serif');


                    // Add foreignObject element inside rectangle
                    const fo = nodeUpdate
                        .patternify({
                            tag: 'foreignObject',
                            selector: 'node-foreign-object',
                            data: d => [d]
                        })


                    // Add foreign object
                    fo.patternify({
                        tag: 'xhtml:div',
                        selector: 'node-foreign-object-div',
                        data: d => [d]
                    })

                    this.restyleForeignObjectElements();


                    // Add Node button circle's group (expand-collapse button)
                    const nodeButtonGroups = nodeEnter
                        .patternify({
                            tag: 'g',
                            selector: 'node-button-g',
                            data: d => [d]
                        })
                        .on('mousedown', d => this.onButtonClick(d))

                    // Add expand collapse button circle
                    nodeButtonGroups
                        .patternify({
                            tag: 'circle',
                            selector: 'node-button-circle',
                            data: d => [d]
                        })

                    // Add button text
                    nodeButtonGroups
                        .patternify({
                            tag: 'text',
                            selector: 'node-button-text',
                            data: d => [d]
                        })
                        .attr('pointer-events', 'none')

                    // Transition to the proper position for the node
                    nodeUpdate.transition()
                        .attr('opacity', 0)
                        .duration(attrs.duration)
                        .attr("transform", ({
                                                x,
                                                y
                                            }) => `translate(${x},${y})`)
                        .attr('opacity', 1)

                    // Move images to desired positions
                    nodeUpdate.selectAll('.node-image-group')
                        .attr('transform', ({
                                                imageWidth,
                                                width,
                                                imageHeight,
                                                height
                                            }) => {
                            let x = -imageWidth / 2 - width / 2;
                            let y = -imageHeight / 2 - height / 2;
                            return `translate(${x},${y})`
                        })

                    // Style node image rectangles
                    nodeUpdate.select('.node-image-rect')
                        .attr('fill', ({
                                           id
                                       }) => `url(#${id})`)
                        .attr('width', ({
                                            imageWidth
                                        }) => imageWidth)
                        .attr('height', ({
                                             imageHeight
                                         }) => imageHeight)
                        .attr('stroke', ({
                                             imageBorderColor
                                         }) => imageBorderColor)
                        .attr('stroke-width', ({
                                                   imageBorderWidth
                                               }) => imageBorderWidth)
                        .attr('rx', ({
                                         imageRx
                                     }) => imageRx)
                        .attr('y', ({
                                        imageCenterTopDistance
                                    }) => imageCenterTopDistance)
                        .attr('x', ({
                                        imageCenterLeftDistance
                                    }) => imageCenterLeftDistance)
                        .attr('filter', ({
                                             dropShadowId
                                         }) => dropShadowId)

                    // Style node rectangles
                    nodeUpdate.select('.node-rect')
                        .attr('width', ({
                                            data
                                        }) => data.width)
                        .attr('height', ({
                                             data
                                         }) => data.height)
                        .attr('x', ({
                                        data
                                    }) => -data.width / 2)
                        .attr('y', ({
                                        data
                                    }) => -data.height / 2)
                        .attr('rx', ({
                                         data
                                     }) => data.borderRadius || 0)
                        .attr('stroke-width', ({
                                                   data
                                               }) => data.borderWidth || attrs.strokeWidth)
                        .attr('cursor', 'pointer')
                        .attr('stroke', ({
                                             borderColor
                                         }) => borderColor)
                        .style("fill", ({
                                            backgroundColor
                                        }) => backgroundColor)

                    // Move node button group to the desired position
                    nodeUpdate.select('.node-button-g')
                        .attr('transform', ({
                                                data
                                            }) => `translate(0,${data.height / 2})`)
                        .attr('opacity', ({
                                              children,
                                              _children
                                          }) => {
                            if (children || _children) {
                                return 1;
                            }
                            return 0;
                        })

                    // Restyle node button circle
                    nodeUpdate.select('.node-button-circle')
                        .attr('r', 16)
                        .attr('stroke-width', ({
                                                   data
                                               }) => data.borderWidth || attrs.strokeWidth)
                        .attr('fill', attrs.backgroundColor)
                        .attr('stroke', ({
                                             borderColor
                                         }) => borderColor)

                    // Restyle button texts
                    nodeUpdate.select('.node-button-text')
                        .attr('text-anchor', 'middle')
                        .attr('alignment-baseline', 'middle')
                        .attr('fill', attrs.defaultTextFill)
                        .attr('font-size', ({
                                                children
                                            }) => {
                            if (children) return 40;
                            return 26;
                        })
                        .text(({
                                   children
                               }) => {
                            if (children) return '-';
                            return '+';
                        })
                        .attr('y', this.isEdge() ? 10 : 0)
                        .attr('pointer-events', 'none')

                    // Remove any exiting nodes after transition
                    const nodeExitTransition = nodesSelection.exit()
                        .attr('opacity', 1)
                        .attr('pointer-events', 'none')
                        .transition()
                        .duration(attrs.duration)
                        .attr("transform", d => `translate(${x},${y})`)
                        .on('end', function () {
                            d3.select(this).remove();
                        })
                        .attr('opacity', 0);

                    // On exit reduce the node rects size to 0
                    nodeExitTransition.selectAll('.node-rect')
                        .attr('width', 10)
                        .attr('height', 10)
                        .attr('x', 0)
                        .attr('y', 0);

                    // On exit reduce the node image rects size to 0
                    nodeExitTransition.selectAll('.node-image-rect')
                        .attr('width', 10)
                        .attr('height', 10)
                        .attr('x', ({
                                        width
                                    }) => width / 2)
                        .attr('y', ({
                                        height
                                    }) => height / 2)

                    // Store the old positions for transition.
                    nodes.forEach(d => {
                        d.x0 = d.x;
                        d.y0 = d.y;
                    });
                }

                // This function detects whether current browser is edge
                isEdge() {
                    return window.navigator.userAgent.includes("Edge");
                }

                /* Function converts rgba objects to rgba color string
                  {red:110,green:150,blue:255,alpha:1}  => rgba(110,150,255,1)
                */
                rgbaObjToColor({
                                   red,
                                   green,
                                   blue,
                                   alpha
                               }) {
                    return `rgba(${red},${green},${blue},${alpha})`;
                }

                // Generate custom diagonal - play with it here - https://to.ly/1zhTK
                diagonal(s, t) {

                    // Calculate some variables based on source and target (s,t) coordinates
                    const x = s.x;
                    const y = s.y;
                    const ex = t.x;
                    const ey = t.y;
                    let xrvs = ex - x < 0 ? -1 : 1;
                    let yrvs = ey - y < 0 ? -1 : 1;
                    let rdef = 35;
                    let rInitial = Math.abs(ex - x) / 2 < rdef ? Math.abs(ex - x) / 2 : rdef;
                    let r = Math.abs(ey - y) / 2 < rInitial ? Math.abs(ey - y) / 2 : rInitial;
                    let h = Math.abs(ey - y) / 2 - r;
                    let w = Math.abs(ex - x) - r * 2;

                    // Build the path
                    const path = `
               M ${x} ${y}
               L ${x} ${y + h * yrvs}
               C  ${x} ${y + h * yrvs + r * yrvs} ${x} ${y + h * yrvs + r * yrvs} ${x + r * xrvs} ${y + h * yrvs + r * yrvs}
               L ${x + w * xrvs + r * xrvs} ${y + h * yrvs + r * yrvs}
               C ${ex}  ${y + h * yrvs + r * yrvs} ${ex}  ${y + h * yrvs + r * yrvs} ${ex} ${ey - h * yrvs}
               L ${ex} ${ey}
             `
                    // Return result
                    return path;
                }

                restyleForeignObjectElements() {
                    const attrs = this.getChartState();

                    attrs.svg.selectAll('.node-foreign-object')
                        .attr('width', ({
                                            width
                                        }) => width)
                        .attr('height', ({
                                             height
                                         }) => height)
                        .attr('x', ({
                                        width
                                    }) => -width / 2)
                        .attr('y', ({
                                        height
                                    }) => -height / 2)
                    attrs.svg.selectAll('.node-foreign-object-div')
                        .style('width', ({
                                             width
                                         }) => `${width}px`)
                        .style('height', ({
                                              height
                                          }) => `${height}px`)
                        .style('color', '#E9DEC9')
                        .html(({
                                   data
                               }) => data.template)
                }

                // Toggle children on click.
                onButtonClick(d) {
                    console.log('click');
                    // If childrens are expanded
                    if (d.children) {

                        //Collapse them
                        d._children = d.children;
                        d.children = null;

                        // Set descendants expanded property to false
                        this.setExpansionFlagToChildren(d, false);
                    } else {

                        // Expand children
                        d.children = d._children;
                        d._children = null;

                        // Set each children as expanded
                        d.children.forEach(({
                                                data
                                            }) => data.expanded = true)
                    }

                    // Redraw Graph
                    this.update(d);
                }

                // This function changes `expanded` property to descendants
                setExpansionFlagToChildren({
                                               data,
                                               children,
                                               _children
                                           }, flag) {

                    // Set flag to the current property
                    data.expanded = flag;

                    // Loop over and recursively update expanded children's descendants
                    if (children) {
                        children.forEach(d => {
                            this.setExpansionFlagToChildren(d, flag)
                        })
                    }

                    // Loop over and recursively update collapsed children's descendants
                    if (_children) {
                        _children.forEach(d => {
                            this.setExpansionFlagToChildren(d, flag)
                        })
                    }
                }

                // This function can be invoked via chart.setExpanded API, it expands or collapses particular node
                setExpanded(id, expandedFlag) {
                    const attrs = this.getChartState();
                    // Retrieve node by node Id
                    const node = attrs.allNodes.filter(({
                                                            data
                                                        }) => data.nodeId == id)[0]

                    // If node exists, set expansion flag
                    if (node) node.data.expanded = expandedFlag;

                    // First expand all nodes
                    attrs.root.children.forEach(d => this.expand(d));

                    // Then collapse all nodes
                    attrs.root.children.forEach(d => this.collapse(d));

                    // Then expand only the nodes, which were previously expanded, or have an expand flag set
                    attrs.root.children.forEach(d => this.expandSomeNodes(d));

                    // Redraw graph
                    this.update(attrs.root);
                }

                // Method which only expands nodes, which have property set "expanded=true"
                expandSomeNodes(d) {

                    // If node has expanded property set
                    if (d.data.expanded) {

                        // Retrieve node's parent
                        let parent = d.parent;

                        // While we can go up
                        while (parent) {

                            // Expand all current parent's children
                            if (parent._children) {
                                parent.children = parent._children;
                            }

                            // Replace current parent holding object
                            parent = parent.parent;
                        }
                    }

                    // Recursivelly do the same for collapsed nodes
                    if (d._children) {
                        d._children.forEach(ch => this.expandSomeNodes(ch));
                    }

                    // Recursivelly do the same for expanded nodes
                    if (d.children) {
                        d.children.forEach(ch => this.expandSomeNodes(ch));
                    }
                }


                // This function updates nodes state and redraws graph, usually after data change
                updateNodesState() {
                    const attrs = this.getChartState();
                    // Store new root by converting flat data to hierarchy
                    attrs.root = d3.stratify()
                        .id(({
                                 nodeId
                             }) => nodeId)
                        .parentId(({
                                       parentNodeId
                                   }) => parentNodeId)
                        (attrs.data)

                    // Store positions, where children appear during their enter animation
                    attrs.root.x0 = 0;
                    attrs.root.y0 = 0;

                    // Store all nodes in flat format (although, now we can browse parent, see depth e.t.c. )
                    attrs.allNodes = attrs.layouts.treemap(attrs.root).descendants()

                    // Store direct and total descendants count
                    attrs.allNodes.forEach(d => {
                        Object.assign(d.data, {
                            directSubordinates: d.children ? d.children.length : 0,
                            totalSubordinates: d.descendants().length - 1
                        })
                    })

                    // Expand all nodes first
                    attrs.root.children.forEach(this.expand);

                    // Then collapse them all
                    attrs.root.children.forEach(d => this.collapse(d));

                    // Then only expand nodes, which have expanded proprty set to true
                    attrs.root.children.forEach(ch => this.expandSomeNodes(ch));

                    // Redraw Graphs
                    this.update(attrs.root)
                }


                // Function which collapses passed node and it's descendants
                collapse(d) {
                    if (d.children) {
                        d._children = d.children;
                        d._children.forEach(ch => this.collapse(ch));
                        d.children = null;
                    }
                }

                // Function which expands passed node and it's descendants
                expand(d) {
                    if (d._children) {
                        d.children = d._children;
                        d.children.forEach(ch => this.expand(ch));
                        d._children = null;
                    }
                }

                // Zoom handler function
                zoomed() {

                    console.log('zoom')
                    const attrs = this.getChartState();
                    const chart = attrs.chart;


                    // Get d3 event's transform object
                    const transform = d3.event.transform;

                    // Store it
                    attrs.lastTransform = transform;

                    // Reposition and rescale chart accordingly
                    chart.attr('transform', transform);

                    // Apply new styles to the foreign object element
                    if (this.isEdge()) {
                        this.restyleForeignObjectElements();
                    }

                }

            }
        )
    });
    main.variable(observer()).define(["md"], function (md) {
        return (
            md`
\`\`\`typescript
interface Chart {
	getAttrs: () => any;
	container: (d?: any) => any;
	svgWidth: (d?: any) => any;
	getChartState: (d?: any) => any;
	updateData: (d?: any) => any;
}
\`\`\`

`
        )
    });
    main.variable(observer()).define(["md"], function (md) {
        return (
            md`Following content is just a little snippet to make code above typescript compatible

Bottom parts aren't interesting, they serve other  technical purpose
`
        )
    });
    main.variable(observer()).define(["html", "typescriptify", "Chart"], function (html, typescriptify, Chart) {
        return (
            html`<textarea cols=80 rows=20 >
${typescriptify(Chart + "")}
</textarea>`
        )
    });
    main.variable(observer("typescriptify")).define("typescriptify", function () {
        return (
            function typescriptify(str) {

                return str.replace(/\t/g, ' ')
                    .replace(/attrs\s?=/g, 'attrs:any = ')


                    .replace(/calc\s?=/g, 'calc:any = ')
                    .replace(/\(d\)\s*\{/g, '(d:any){')
                    .replace(/d=>/g, '(d:any)=>')
                    .replace(/d =>/g, '(d:any)=>')
                    .replace(/ch =>/g, '(ch:any)=>')
                    .replace(/\(d, i\)/g, '(d:any,i:number)')
                    .replace(/\(s, t\)/g, '(s:any,t:any)')
                    .replace(/\(params\)/g, '(params:any)')
                    .replace(/\(id, expandedFlag\)/g, '(id:any,expandedFlag:boolean)')
                    .replace(/\(node, flag\)/g, '(node:any,flag:boolean)')

                    .replace(/\(node, nodeIdsStore\)/g, '(node:any,nodeIdsStore:any[])')


                    .replace(/layouts\s?=/g, 'layouts:any = ')
                    .replace(/behaviors\s?=/g, 'behaviors:any = ')
                    .replace(/\(source\)/g, '(source:any)')
                    .replace(/\(\s?d\s?=>/g, '((d:any)=>')
                return str;
            }
        )
    });
    main.variable(observer()).define(["md"], function (md) {
        return (
            md`## Button actions`
        )
    });
    main.variable(observer()).define(["addBtn", "DOM", "chart"], function (addBtn, DOM, chart) {
            // EXPAND
            addBtn;
            if (this) {
                setTimeout(d => {

                    const node = {
                        "nodeId": DOM.uid().id,
                        "parentNodeId": "O-1",
                        "width": 330,
                        "height": 147,
                        "borderWidth": 1,
                        "borderRadius": 5,
                        "borderColor": {
                            "red": 15,
                            "green": 140,
                            "blue": 121,
                            "alpha": 1
                        },
                        "backgroundColor": {
                            "red": 51,
                            "green": 182,
                            "blue": 208,
                            "alpha": 1
                        },
                        "nodeImage": {
                            "url": "https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg",
                            "width": 100,
                            "height": 100,
                            "centerTopDistance": 0,
                            "centerLeftDistance": 0,
                            "cornerShape": "ROUNDED",
                            "shadow": false,
                            "borderWidth": 0,
                            "borderColor": {
                                "red": 19,
                                "green": 123,
                                "blue": 128,
                                "alpha": 1
                            }
                        },
                        "nodeIcon": {
                            "icon": "https://to.ly/1yZnX",
                            "size": 30
                        },
                        "connectorLineColor": {
                            "red": 220,
                            "green": 189,
                            "blue": 207,
                            "alpha": 1
                        },
                        "connectorLineWidth": 5,
                        "dashArray": "",
                        "expanded": false,
                        template: `<div>
                  <div style="margin-left:80px;
                              margin-top:10px;
                              font-size:20px;
                              font-weight:bold;
                         ">Added Root Child </div>
                 <div style="margin-left:80px;
                              margin-top:3px;
                              font-size:16px;
                         ">Added position </div>

                 <div style="margin-left:80px;
                              margin-top:3px;
                              font-size:14px;
                         ">Added unit</div>

                 <div style="margin-left:200px;
                             margin-top:15px;
                             font-size:13px;
                             position:absolute;
                             bottom:5px;
                            ">
                      <div>Added office</div>
                      <div style="margin-top:5px">Added area</div>
                 </div>
              </div>`
                    }

                    chart.addNode(node)
                }, 600)

                return true;
            }
            return !this;
        }
    );
    main.variable(observer()).define(["addBtnG", "DOM", "chart"], function (addBtnG, DOM, chart) {
            // EXPAND
            addBtnG;
            if (this) {
                setTimeout(d => {

                    const node = {
                        "nodeId": DOM.uid().id,
                        "parentNodeId": "O-2",
                        "width": 330,
                        "height": 147,
                        "borderWidth": 1,
                        "borderRadius": 5,
                        "borderColor": {
                            "red": 15,
                            "green": 140,
                            "blue": 121,
                            "alpha": 1
                        },
                        "backgroundColor": {
                            "red": 51,
                            "green": 182,
                            "blue": 208,
                            "alpha": 1
                        },
                        "nodeImage": {
                            "url": "https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg",
                            "width": 100,
                            "height": 100,
                            "centerTopDistance": 0,
                            "centerLeftDistance": 0,
                            "cornerShape": "ROUNDED",
                            "shadow": false,
                            "borderWidth": 0,
                            "borderColor": {
                                "red": 19,
                                "green": 123,
                                "blue": 128,
                                "alpha": 1
                            }
                        },
                        "nodeIcon": {
                            "icon": "https://to.ly/1yZnX",
                            "size": 30
                        },
                        "connectorLineColor": {
                            "red": 220,
                            "green": 189,
                            "blue": 207,
                            "alpha": 1
                        },
                        "connectorLineWidth": 5,
                        "dashArray": "",
                        "expanded": true,
                        template: `<div>
                  <div style="margin-left:80px;
                              margin-top:10px;
                              font-size:20px;
                              font-weight:bold;
                         ">Added Root Grand Child </div>
                 <div style="margin-left:80px;
                              margin-top:3px;
                              font-size:16px;
                         ">Added position </div>

                 <div style="margin-left:80px;
                              margin-top:3px;
                              font-size:14px;
                         ">Added unit</div>

                 <div style="margin-left:200px;
                             margin-top:15px;
                             font-size:13px;
                             position:absolute;
                             bottom:5px;
                            ">
                      <div>Added office</div>
                      <div style="margin-top:5px">Added area</div>
                 </div>
              </div>`
                    }

                    chart.addNode(node)
                }, 600)

                return true;
            }
            return !this;
        }
    );
    main.variable(observer()).define(["removeBtn", "chart"], function (removeBtn, chart) {
            // EXPAND
            removeBtn;
            if (this) {
                setTimeout(d => {
                    chart.removeNode("O-5")
                }, 300)

                return true;
            }
            return !this;
        }
    );
    main.variable(observer()).define(["removeGrandChildBtn", "chart"], function (removeGrandChildBtn, chart) {
            removeGrandChildBtn;
            if (this) {
                setTimeout(d => {
                    chart.removeNode("O-6")
                }, 450)

                return true;
            }
            return !this;
        }
    );
    main.variable(observer()).define(["chartRendering", "chart", "zoom"], function (chartRendering, chart, zoom) {
            chartRendering;
            //ZOOM
            chart.setZoomFactor(zoom);
        }
    );
    main.variable(observer()).define(["expandBtn", "chart"], function (expandBtn, chart) {
            // EXPAND
            expandBtn;
            if (this) {
                setTimeout(d => {
                    chart.setExpanded("O-111", true)
                }, 900)

                return Math.random();
            }
            return !this;
        }
    );
    main.variable(observer()).define(["collapseBtn", "chart"], function (collapseBtn, chart) {
            //  COLLAPSE
            collapseBtn;
            if (this) {
                setTimeout(d => {
                    chart.setExpanded("O-111", false)
                }, 100)
                return true;
            }
            return !this;
        }
    );
    main.variable(observer()).define(["md"], function (md) {
        return (
            md`## Data wrangling`
        )
    });
    main.variable(observer("dataSource")).define("dataSource", ["load"], function (load) {
        return (
            load('https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/redesignedChartLongData.json')
        )
    });
    main.variable(observer("dataFlattened")).define("dataFlattened", ["d3", "dataSource", "DOM"], function (d3, dataSource, DOM) {
        return (
            d3.hierarchy(dataSource)
                .descendants()
                .map((d, i) => Object.assign(d, {id: DOM.uid().id}))
                .map(d => Object.assign(d.data, {
                    id: d.id,
                    parentId: d.parent && d.parent.id
                }))
        )
    });
    main.variable(observer()).define(["md"], function (md) {
        return (
            md`## Libs`
        )
    });
    main.variable(observer("d3")).define("d3", ["require"], function (require) {
        return (
            require('d3@v5')
        )
    });
    const child1 = runtime.module(define1);
    main.import("load", child1);
    const child2 = runtime.module(define2);
    main.import("slider", child2);
    main.import("button", child2);
    return main;
}
