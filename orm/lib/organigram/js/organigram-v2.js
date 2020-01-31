//d3 = require('d3');
//import * as d3 from "d3";

class TreeChart {
    constructor() {
        // Exposed variables
        const attrs = {
            id: `ID${Math.floor(Math.random() * 1000000)}`, // Id for event handlings
            template: 'none',
            svgWidth: 800,
            svgHeight: 600,
            marginTop: 0,
            marginBottom: 0,
            marginRight: 0,
            marginLeft: 0,
            container: 'body',
            defaultTextFill: '#2C3E50',
            nodeTextFill: 'white',
            defaultFont: 'Helvetica',
            backgroundColor: '#fafafa',
            rawData: null,
            data: null,
            depth: 180,
            duration: 600,
            strokeWidth: 3,
            dropShadowId: null,
            initialZoom: 1,
            imagePath: '.',
            //onNodeClick: d => d,
            onNodeClick: (nodeId, node, chart) => {},
            onNodeUpdate: (data, nodeId, chart) => {},
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
    getNodeChildrenIds({data, children, _children}, nodeIdsStore) {

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
        };
        attrs.layouts = layouts;

        // Generate tree layout function
        layouts.treemap = d3.tree().size([calc.chartWidth, calc.chartHeight])
            .nodeSize([calc.nodeMaxWidth + 100, calc.nodeMaxHeight + attrs.depth]);

        // ******************* BEHAVIORS . **********************
        const behaviors = {
            zoom: null
        };

        // Get zooming function 
        behaviors.zoom = d3.zoom().on("zoom", d => this.zoomed(d));

        //****************** ROOT node work ************************

        // Convert flat data to hierarchical
        attrs.root = d3.stratify().id(({nodeId}) => nodeId).parentId(({parentNodeId}) => parentNodeId)(attrs.data);

        // Set child nodes enter appearance positions
        attrs.root.x0 = 0;
        attrs.root.y0 = 0;

        /** Get all nodes as array (with extended parent & children properties set)
            This way we can access any node's parent directly using node.parent - pretty cool, huh?
        */
        attrs.allNodes = attrs.layouts.treemap(attrs.root).descendants();

        // Assign direct children and total subordinate children's cound
        attrs.allNodes.forEach(d => {
            Object.assign(d.data, {
                directSubordinates: d.children ? d.children.length : 0,
                totalSubordinates: d.descendants().length - 1
            })
        });

        // Collapse all children at first
        attrs.root.children.forEach(d => this.collapse(d));

        // Then expand some nodes, which have `expanded` property set
        attrs.root.children.forEach(d => this.expandSomeNodes(d));

        attrs.root.data.expanded = true;

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
        }).attr('transform', `translate(${calc.centerX},${calc.nodeMaxHeight / 2}) scale(${attrs.initialZoom})`);

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
            .attr("y", 8);

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
            .attr('in', 'SourceGraphic');

        // Display tree contenrs
        this.update(attrs.root);

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

    updateNodeData(rawData) {
        const attrs = this.getChartState();
        // locate node
        const oldRawData = attrs.rawData.filter(({
                                                data
                                            }) => data.id === rawData.id)[0];
        // update data
        const newRawData = {...oldRawData, ...rawData};

        // Redraw graph
        //this.update(attrs.root);
        // Update state of nodes and redraw graph
        this.updateNodesState();
        return this;
    }

    // This function can be invoked via chart.removeNode API, and it removes node from tree at runtime
    removeNode(nodeId) {
        const attrs = this.getChartState();
        const node = attrs.allNodes.filter(({
            data
        }) => data.nodeId === nodeId)[0];

        // Remove all node childs
        if (node) {
            // Retrieve all children nodes ids (including current node itself)
            const nodeChildrenIds = this.getNodeChildrenIds(node, []);

            // Filter out retrieved nodes and reassign data
            attrs.data = attrs.data.filter(d => !nodeChildrenIds.includes(d.nodeId));

            const updateNodesState = this.updateNodesState.bind(this);
            // Update state of nodes and redraw graph
            updateNodesState();
        }
    }

    // This function basically redraws visible graph, based on nodes state
    update({x0, y0, x, y}) {
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
                if (d.data.nodeImage && d.data.nodeImage.height) {
                    imageHeight = d.data.nodeImage.height
                }
                if (d.data.nodeImage && d.data.nodeImage.borderColor) {
                    imageBorderColor = this.rgbaObjToColor(d.data.nodeImage.borderColor)
                }
                if (d.data.nodeImage && d.data.nodeImage.borderWidth) {
                    imageBorderWidth = d.data.nodeImage.borderWidth
                }
                if (d.data.nodeImage && d.data.nodeImage.centerTopDistance) {
                    imageCenterTopDistance = d.data.nodeImage.centerTopDistance
                }
                if (d.data.nodeImage && d.data.nodeImage.centerLeftDistance) {
                    imageCenterLeftDistance = d.data.nodeImage.centerLeftDistance
                }
                if (d.data.borderColor) {
                    borderColor = this.rgbaObjToColor(d.data.borderColor);
                }
                if (d.data.backgroundColor) {
                    backgroundColor = this.rgbaObjToColor(d.data.backgroundColor);
                }
                if (d.data.nodeImage && d.data.nodeImage.cornerShape.toLowerCase() === "circle") {
                    imageRx = Math.max(imageWidth, imageHeight);
                }
                if (d.data.nodeImage && d.data.nodeImage.cornerShape.toLowerCase() === "rounded") {
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
        const patternEnterSelection = patternsSelection.enter().append('pattern');

        // Patters update selection
        const patterns = patternEnterSelection
            .merge(patternsSelection)
            .attr('class', 'pattern')
            .attr('height', 1)
            .attr('width', 1)
            .attr('id', ({
                id
            }) => id);

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
            .attr('preserveAspectRatio', 'xMidYMin slice');

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
            });

        // Transition back to the parent element position
        linkUpdate.transition()
            .duration(attrs.duration)
            .attr('d', d => this.diagonal(d, d.parent));

        // Remove any  links which is exiting after animation
        const linkExit = linkSelection.exit().transition()
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
            }) => id);

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = nodesSelection.enter().append('g')
            .attr('class', 'node')
            .attr("transform", d => `translate(${x0},${y0})`)
            .attr('cursor', 'pointer')
            .on('click', ({
                data
            }) => {
                if ([...d3.event.srcElement.classList].includes('node-button-circle')) {
                    return;
                }
                //attrs.onNodeClick(data.nodeId);
                attrs.onNodeClick(data.nodeId, data, this);
            });

        // Add background rectangle for the nodes 
        nodeEnter.patternify({
                tag: 'rect',
                selector: 'node-rect',
                data: d => [d]
            })
            .style("fill", ({
                _children
            }) => _children ? "lightsteelblue" : "#fff");

        // Node update styles
        const nodeUpdate = nodeEnter.merge(nodesSelection).style('font', '12px sans-serif');

        /*
         * Start : node content with template
         */
        // Add foreignObject element inside rectangle
        const fo = nodeUpdate.patternify({
                tag: 'foreignObject',
                selector: 'node-foreign-object',
                data: d => [d]
            });

        // Add foreign object
        fo.patternify({
            tag: 'xhtml:div',
            selector: 'node-foreign-object-div',
            data: d => [d]
        });

        this.restyleForeignObjectElements();
        /*
         * End : node content with template
         */

        /*
         * Start : photos
         */
        // Defined node images wrapper group
        const nodeImageGroups = nodeEnter.patternify({
            tag: 'g',
            selector: 'node-image-group',
            data: d => [d]
        });

        // Add background rectangle for node image
        nodeImageGroups
            .patternify({
                tag: 'rect',
                selector: 'node-image-rect',
                data: d => [d]
            });
        /*
         * End : photos
         */

        /*
         * Start : close button
         */
        const nodeCloseButtonGroups = nodeEnter.patternify({
            tag: 'g',
            selector: 'node-button-close',
            data: d => [d]
        })
            .on('click', d => this.onButtonCloseClick(d));

        // Add expand collapse button circle
        nodeCloseButtonGroups.patternify({
            tag: 'circle',
            selector: 'node-button-close-circle',
            data: d => [d]
        });

        // Add button text
        nodeCloseButtonGroups.patternify({
            tag: 'text',
            selector: 'node-button-close-text',
            data: d => [d]
        })
            .attr('pointer-events', 'none');

        // Move node button group to the desired position
        nodeUpdate.select('.node-button-close')
            .attr('transform', ({data}) => `translate(${data.width / 2}, -${data.height / 2})`)
            .attr('opacity', ({data}) => {
                return data.nodeId === 'node-0' ? 0 : 1;
            });

        // Restyle node button circle
        nodeUpdate.select('.node-button-close-circle')
            .attr('r', 16)
            .attr('stroke-width', ({data}) => data.borderWidth || attrs.strokeWidth)
            .attr('fill', attrs.backgroundColor)
            .attr('stroke', ({borderColor}) => borderColor);

        // Restyle button texts
        nodeUpdate.select('.node-button-close-text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('fill', attrs.defaultTextFill)
            .attr('font-size', 40)
            .text('X')
            .attr('y', this.isEdge() ? 10 : 0);
        /*
         * End : close button
         */

        /*
         * Start : update button
         */
        const nodeUpdateButtonGroups = nodeEnter.patternify({
            tag: 'g',
            selector: 'node-button-update',
            data: d => [d]
        })
            .on('click', d => this.onButtonUpdateClick(d));

        // Add expand collapse button circle
        nodeUpdateButtonGroups.patternify({
            tag: 'circle',
            selector: 'node-button-update-circle',
            data: d => [d]
        });

        // Add button text
        nodeUpdateButtonGroups.patternify({
            tag: 'text',
            selector: 'node-button-update-text',
            data: d => [d]
        })
            .attr('pointer-events', 'none');

        // Move node button group to the desired position
        nodeUpdate.select('.node-button-update')
            .attr('transform', ({data}) => `translate(${data.width / 2 - 40}, -${data.height / 2})`)
            .attr('opacity', 1);

        // Restyle node button circle
        nodeUpdate.select('.node-button-update-circle')
            .attr('r', 16)
            .attr('stroke-width', ({data}) => data.borderWidth || attrs.strokeWidth)
            .attr('fill', attrs.backgroundColor)
            .attr('stroke', ({borderColor}) => borderColor);

        // Restyle button texts
        nodeUpdate.select('.node-button-update-text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('fill', attrs.defaultTextFill)
            .attr('font-size', 40)
            .text('U')
            .attr('y', this.isEdge() ? 10 : 0);
        /*
         * End : update button
         */

        /*
         * Start : expand/collapse button
         */
        // Add Node button circle's group (expand-collapse button)
        const nodeExpandButtonGroups = nodeEnter.patternify({
                tag: 'g',
                selector: 'node-button-g',
                data: d => [d]
            })
            .on('click', d => this.onButtonClick(d));

        // Add expand collapse button circle
        nodeExpandButtonGroups.patternify({
                tag: 'circle',
                selector: 'node-button-circle',
                data: d => [d]
            });

        // Add button text
        nodeExpandButtonGroups.patternify({
                tag: 'text',
                selector: 'node-button-text',
                data: d => [d]
            })
            .attr('pointer-events', 'none');

        // Move node button group to the desired position
        nodeUpdate.select('.node-button-g')
            .attr('transform', ({data}) => `translate(0,${data.height / 2})`)
            .attr('opacity', ({children, _children}) => {
                if (children || _children) {
                    return 1;
                }
                return 0;
            });

        // Restyle node button circle
        nodeUpdate.select('.node-button-circle')
            .attr('r', 16)
            .attr('stroke-width', ({data}) => data.borderWidth || attrs.strokeWidth)
            .attr('fill', attrs.backgroundColor)
            .attr('stroke', ({borderColor}) => borderColor);

        // Restyle button texts
        nodeUpdate.select('.node-button-text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('fill', attrs.defaultTextFill)
            .attr('font-size', ({children}) => {
                if (children) return 40;
                return 26;
            })
            .text(({children}) => {
                if (children) return '-';
                return '+';
            })
            .attr('y', this.isEdge() ? 10 : 0);
        /*
         * End : expand/collapse button
         */

        // Transition to the proper position for the node
        nodeUpdate.transition()
            .attr('opacity', 0)
            .duration(attrs.duration)
            .attr("transform", ({x, y}) => `translate(${x},${y})`)
            .attr('opacity', 1);

        // Move images to desired positions
        nodeUpdate.selectAll('.node-image-group')
            .attr('transform', ({imageWidth, width, imageHeight, height}) => {
                let x = -imageWidth / 2 - width / 2;
                let y = -imageHeight / 2 - height / 2.5;
                return `translate(${x},${y})`
            });

        // Style node image rectangles
        nodeUpdate.select('.node-image-rect')
            .attr('fill', ({id}) => `url(#${id})`)
            .attr('width', ({imageWidth}) => imageWidth)
            .attr('height', ({imageHeight}) => imageHeight)
            .attr('stroke', ({imageBorderColor}) => imageBorderColor)
            .attr('stroke-width', ({imageBorderWidth}) => imageBorderWidth)
            .attr('rx', ({imageRx}) => imageRx)
            .attr('y', ({imageCenterTopDistance}) => imageCenterTopDistance)
            .attr('x', ({imageCenterLeftDistance}) => imageCenterLeftDistance)
            .attr('filter', ({dropShadowId}) => dropShadowId);

        // Style node rectangles
        nodeUpdate.select('.node-rect')
            .attr('width', ({data}) => data.width)
            .attr('height', ({data}) => data.height)
            .attr('x', ({data}) => -data.width / 2)
            .attr('y', ({data}) => -data.height / 2)
            .attr('rx', ({data}) => data.borderRadius || 0)
            .attr('stroke-width', ({data}) => data.borderWidth || attrs.strokeWidth)
            .attr('cursor', 'pointer')
            .attr('stroke', ({borderColor}) => borderColor)
            .style("fill", ({backgroundColor}) => backgroundColor);

        // Remove any exiting nodes after transition
        const nodeExitTransition = nodesSelection.exit()
            .attr('opacity', 1)
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
            }) => height / 2);

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
    rgbaObjToColor({red, green, blue, alpha}) {
        return `rgba(${red},${green},${blue},${alpha})`;
    }

    // Generate custom diagonal - play with it here - https://observablehq.com/@bumbeishvili/curved-edges?collection=@bumbeishvili/work-components
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
            }) => -height / 2);
        attrs.svg.selectAll('.node-foreign-object-div')
            .style('width', ({
                width
            }) => `${width}px`)
            .style('height', ({
                height
            }) => `${height}px`)
            .style('color', 'white')
            .html(({
                data
            }) => data.template);
    }

    onButtonCloseClick(d) {
        this.removeNode(d.data.nodeId);
    }

    onButtonUpdateClick(d) {
        const attrs = this.getChartState();
        // Retrieve node by node Id
        // const rawData = attrs.rawData.filter(({
        //                                         data
        //                                     }) => data.nodeId === d.data.nodeId)[0];
        attrs.onNodeUpdate(d.data.rawData, d.data.nodeId, this);
    }

    // Toggle children on click.
    onButtonClick(d) {
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

    toggle(nodeId) {
        const attrs = this.getChartState();
        // Retrieve node by node Id
        const node = attrs.allNodes.filter(({
                                                data
                                            }) => data.nodeId === nodeId)[0];

        // If node exists, set expansion flag
        if (node) {
            this.onButtonClick(node);
            // if (node.data.expanded) {
            //     this.collapse(node);
            // } else {
            //     this.expand(node);
            // }
            // node.data.expanded = !node.data.expanded;
            //
            // // Redraw Graph
            // this.update(node);
        }
    }

    selectTemplate(templateName) {
        const attrs = this.getChartState();
        attrs.template = templateName;
        this.flattenData();
        this.render();
    }

    // This function changes `expanded` property to descendants
    setExpansionFlagToChildren({data, children, _children}, flag) {
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
        }) => data.nodeId === id)[0];

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
        try {
        attrs.root = d3.stratify().id(({nodeId}) => nodeId).parentId(({parentNodeId}) => parentNodeId)(attrs.data);
        } catch (e) {
            console.log("Failed to update nodes : " + e.message);
            return;
        }

        // Store positions, where children appear during their enter animation
        attrs.root.x0 = 0;
        attrs.root.y0 = 0;

        // Store all nodes in flat format (although, now we can browse parent, see depth e.t.c. )
        attrs.allNodes = attrs.layouts.treemap(attrs.root).descendants();

        // Store direct and total descendants count
        attrs.allNodes.forEach(d => {
            Object.assign(d.data, {
                directSubordinates: d.children ? d.children.length : 0,
                totalSubordinates: d.descendants().length - 1
            })
        });

        if (attrs.root.children) {
            // Expand all nodes first
            attrs.root.children.forEach(this.expand);

            // Then collapse them all
            attrs.root.children.forEach(d => this.collapse(d));

            // Then only expand nodes, which have expanded proprty set to true
            attrs.root.children.forEach(ch => this.expandSomeNodes(ch));
        }

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

    flattenData() {
        const attrs = this.getChartState();
        attrs.data = d3.hierarchy(attrs.rawData)
                .descendants()
                .map((d, i) => Object.assign(d, {
                    id: "node-" + i /*DOM.uid().id*/,
                    nodeId: "node-" + i
                }))
                .map(d => Object.assign(d.data, {
                    id: d.id,
                    nodeId: d.nodeId,
                    parentId: d.parent && d.parent.id,
                    parentNodeId: d.parent && d.parent.nodeId
                })).map(d => {

                let width = 500; //Math.round(Math.random() * 50 + 300);
                let height = Math.round(Math.random() * 20 + 130 + 100) + 50 * Math.round(Math.random() * 2);

                const cornerShape = 'ROUNDED'; //['ORIGINAL', 'ROUNDED', 'CIRCLE'][Math.round(Math.random() * 2)];
                const nodeImageWidth = 100;
                const nodeImageHeight = 100;
                const centerTopDistance = 0;
                const centerLeftDistance = 0;
                const borderRadius = 0; //15;
                const expanded = false; //d.id=="O-6"

                const titleMarginLeft = nodeImageWidth / 2 + 20 + centerLeftDistance;
                const normalMarginLeft = 20;
                const contentMarginLeft = width / 2 + 25;

                const colorCardBackground = 'white';
                const colorRed = 'red';
                const colorYellow = '#FFBF00';
                const colorName = '#519ED4';
                const colorBorderGray = 'darkgray';
                const colorBorderBlue = '#2C578C';
                const colorBackgroundGrey = 'lightgray';
                const colorBackgroundBlue = '#3270E1';

                let template = `<div style="margin-left:0; margin-top:0; font-size:16px; color: black; white-space: nowrap;">`;
                switch (attrs.template) {
                    case 'simple':
                        height = 110;
                        template += `
                            <div style="padding: 10px 10px 20px ${titleMarginLeft}px; border: 4px solid ${colorBackgroundBlue};">
                                <div style="font-size:20px; font-weight: bold;">${d.position}</div>
                                <div style="margin-top:5px; font-size:18px; font-weight: bold;">${d.firstname} ${d.lastname}</div>
                                <div style="margin-top:5px;">${d.jobTenure}</div>
                            </div>
                        `;
                        break;
                    case 'omr' :
                    case 'full' :
                        d.isGroupKeyPosition = d.keyPosition === 'GKP';
                        d.isGroupKeyContributor = d.keyContributor === 'GKC';
                        d.isCompanyKeyPosition = d.keyPosition === 'CKP';
                        d.isCompanyKeyContributor = d.keyContributor === 'CKC';

                        /// max 8 potential successors

                        d._criticalText = d.criticalExpert ? '<span style="color: blue; font-weight: bolder; font-size: 24px;">*</span>' : '';
                        d._highRetentionText = d.retentionRisk ? '<span style="color: red; font-weight: bold">!</span>' : '';
                        d._borderPosition = d.isGroupKeyPosition ? `border: 4px solid red; border-radius: ${borderRadius}px ${borderRadius}px 0 0;` : (d.isCompanyKeyPosition ? `border: 4px solid blue; border-radius: ${borderRadius}px ${borderRadius}px 0 0;` : '');
                        d._colorName = d.isGroupKeyContributor ? 'red' : (d.isCompanyKeyContributor ? 'blue' : 'white');

                        height = 92
                            + (d.futura ? 8 : 0)
                            + (d.isGroupKeyPosition || d.isCompanyKeyPosition ? 8 : 0)
                            + (d.leadSuccessor ? 42 : 0)
                            + (d.potentialSuccessor ? 36 + 18 * d.potentialSuccessor.length: 0);
                        if (d.futura) {
                            template += `<div style="border: 4px dashed ${colorYellow}; border-radius: ${borderRadius}px ${borderRadius}px 0 0;">`;
                        }
                        template += `
                            <div style="padding: 10px 10px 10px ${titleMarginLeft}px; ${d._borderPosition}">
                                <div style="font-size:20px; font-weight: bold;">${d.position}</div>
                                <div style="margin-top:5px; font-size:18px; font-weight: bold; color: ${d._colorName};">${d.firstname} ${d.lastname}</div>
                                <div style="margin-top:5px; ">${d.jobTenure} ${d._highRetentionText} ${d._criticalText}</div>
                            </div>`;
                        if (d.futura) {
                            template += `</div>`;
                        }
                        if (d.leadSuccessor) {
                            template += `
                            <div style="padding: 10px; border: 2px solid ${colorBorderGray}; background: ${colorBackgroundGrey};">
                                <div style="">${d.leadSuccessor.firstname} ${d.leadSuccessor.lastname}</div>
                            </div>`;
                        }
                        if (d.potentialSuccessor) {
                            template += `
                                <div style="border: 2px solid ${colorBorderGray};">
                                    <ul>`;
                            d.potentialSuccessor.forEach(ps => {
                                template += `<li>${ps.firstname} ${ps.lastname} ${ps.readiness}</li>`;
                            });
                            template += `
                                    </ul>
                                </div>`;
                        }
                        if (attrs.template === 'full') {
                            height += 50;
                            template += `<div style="padding: 10px 10px 20px 10px; color: white; background: ${colorBackgroundBlue}">`;
                            if (d.potentialNextStep) {
                                d.potentialNextStep.forEach(ns => {
                                    template += `<div>${ns.position} ${ns.readiness}</div>`;
                                });
                            }
                            template += ` </div> `;
                        }
                        break;
                    case 'next':
                        height = 97 + 30 + 18 * (d.potentialNextStep ? d.potentialNextStep.length : 0);
                        template += `
                            <div style="padding: 10px 10px 10px ${titleMarginLeft}px; border: 4px solid ${colorBackgroundBlue}; border-bottom: none;">
                                <div style="font-size:20px; font-weight: bold;">${d.position}</div>
                                <div style="margin-top:5px; font-size:18px; font-weight: bold;">${d.firstname} ${d.lastname}</div>
                                <div style="margin-top:5px;">${d.jobTenure}</div>
                            </div>
                            <div style="padding: 10px 10px 20px 10px; color: white; background: ${colorBackgroundBlue}">`;
                        if (d.potentialNextStep) {
                            d.potentialNextStep.forEach(ns => {
                                template += `<div>${ns.position} ${ns.readiness}</div>`;
                            });
                        }
                        template += ` </div> `;
                        break;
                    default:
                        template = `UNKNOWN TEMPLATE : ${attrs.template}`;
                        break;
                }
                template += `</div>`;

                return {
                    nodeId: d.id,
                    parentNodeId: d.parentId,
                    width: width,
                    height: height,
                    borderWidth: 1,
                    borderRadius: borderRadius,
                    borderColor: {
                        red: 15,
                        green: 140,
                        blue: 121,
                        alpha: 1,
                    },
                    backgroundColor: {
                        red: 255, //0,
                        green: 255, //81,
                        blue: 255, //90,
                        alpha: 1,
                    },
                    nodeImage: {
                        url: (d.avatar ? d.avatar : attrs.imagePath + '/default-avatar.jpg'),
                        width: nodeImageWidth,
                        height: nodeImageHeight,
                        centerTopDistance: centerTopDistance,
                        centerLeftDistance: centerLeftDistance,
                        cornerShape: cornerShape,
                        shadow: true,
                        borderWidth: 0,
                        borderColor: {
                            red: 19,
                            green: 123,
                            blue: 128,
                            alpha: 1,
                        },
                    },
                    nodeIcon: {
                        icon: "https://to.ly/1yZnX",
                        size: 30
                    },
                    template: template,
                    //   template: `<div>
                    //
                    //    <div style="margin-left:0px; margin-top:0px; font-size:13px; border: 1px solid red;">
                    //       <div style="margin-left:${titleMarginLeft}px; margin-top:3px; font-size:20px;">${d.positionName}</div>
                    //       <div style="margin-left:${titleMarginLeft}px; margin-top:10px; font-size:16px;">${d.name}</div>
                    //       <div style="margin-left:${titleMarginLeft}px; margin-top:10px; font-size:16px;">Job tenure   !</div>
                    //    </div>
                    //    <div style="margin-left:0px; margin-top:0px; font-size:13px; border: 1px solid grey; background: lightgray;">
                    //       <div style="margin-left:${normalMarginLeft}px; margin-top:3px; font-size:20px;">${d.positionName}</div>
                    //       <div style="margin-left:${normalMarginLeft}px; margin-top:10px; font-size:16px;">${d.name}</div>
                    //       <div style="margin-left:${normalMarginLeft}px; margin-top:10px; font-size:16px;">Job tenure   !</div>
                    //    </div>
                    //    <div style="margin-left:0px; margin-top:0px; font-size:13px;">
                    //       <ul>
                    //           <li>dsfsd fds sd</li>
                    //           <li> fsdfdsf dsf sdf </li>
                    //       </ul>
                    //    </div>
                    //
                    //
                    //
                    //     <div style="margin-left:${titleMarginLeft}px; margin-top:10px; font-size:20px; font-weight:bold; ">${d.name} </div>
                    //    <div style="margin-left:${titleMarginLeft}px; margin-top:3px; font-size:16px; ">${d.positionName}  </div>
                    //
                    //    <div style="margin-left:${titleMarginLeft}px; margin-top:3px; font-size:14px; ">${d.unit.value}</div>
                    //
                    //    <div style="margin-left:${contentMarginLeft}px; margin-top:15px; font-size:13px; position:absolute; bottom:5px; ">
                    //         <div>${d.office}</div>
                    //         <div style="margin-top:5px">${d.area}</div>
                    //    </div>
                    // </div>`,
                    connectorLineColor: {
                        red: 11,
                        green: 123,
                        blue: 108,
                        alpha: 1
                    },
                    connectorLineWidth: 5,
                    dashArray: '',
                    expanded: expanded,
                    rawData : d
                }
            });
        return this;
    }

    exportImage() {
        const attrs = this.getChartState();
        let svg = attrs.svg.node();

        //480p
        //let width = 720, height = 480;
        //720p
        //let width = 1280, height = 720;
        //1080p
        //let width = 1980, height = 1080;
        //4k
        //let width = 3840, height = 2160;
        //8k
        //let width = 7680, height = 4320;

        let width = svg.width.baseVal.value;
        let height = svg.height.baseVal.value;

        svgString2Image( getSVGString(svg), 2*width, 2*height, 'png', save ); // passes Blob and filesize String to the callback

        function save( dataBlob, filesize ){
            saveAs( dataBlob, 'D3 vis exported to PNG.png' ); // FileSaver.js function
        }
    }
}

// Below are the functions that handle actual exporting:
// getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
function getSVGString(svgNode) {
    svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    var cssStyleText = getCSSStyles(svgNode);
    appendCSS(cssStyleText, svgNode);

    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(svgNode);
    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

    return svgString;

    function getCSSStyles(parentElement) {
        var selectorTextArr = [];

        // Add Parent element Id and Classes to the list
        selectorTextArr.push('#' + parentElement.id);
        for (var c = 0; c < parentElement.classList.length; c++)
            if (!contains('.' + parentElement.classList[c], selectorTextArr))
                selectorTextArr.push('.' + parentElement.classList[c]);

        // Add Children element Ids and Classes to the list
        var nodes = parentElement.getElementsByTagName("*");
        for (var i = 0; i < nodes.length; i++) {
            var id = nodes[i].id;
            if (!contains('#' + id, selectorTextArr))
                selectorTextArr.push('#' + id);

            var classes = nodes[i].classList;
            for (var c = 0; c < classes.length; c++)
                if (!contains('.' + classes[c], selectorTextArr))
                    selectorTextArr.push('.' + classes[c]);
        }

        // Extract CSS Rules
        var extractedCSSText = "";
        for (var i = 0; i < document.styleSheets.length; i++) {
            var s = document.styleSheets[i];

            try {
                if (!s.cssRules) continue;
            } catch (e) {
                if (e.name !== 'SecurityError') throw e; // for Firefox
                continue;
            }

            var cssRules = s.cssRules;
            for (var r = 0; r < cssRules.length; r++) {
                if (contains(cssRules[r].selectorText, selectorTextArr))
                    extractedCSSText += cssRules[r].cssText;
            }
        }


        return extractedCSSText;

        function contains(str, arr) {
            return arr.indexOf(str) === -1 ? false : true;
        }

    }

    function appendCSS(cssText, element) {
        var styleElement = document.createElement("style");
        styleElement.setAttribute("type", "text/css");
        styleElement.innerHTML = cssText;
        var refNode = element.hasChildNodes() ? element.children[0] : null;
        element.insertBefore(styleElement, refNode);
    }
}

function svgString2Image(svgString, width, height, format, callback) {
    var format = format ? format : 'png';

    var imgsrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to data URL

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    var image = new Image();
    image.onload = function () {
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);

        canvas.toBlob(function (blob) {
            var filesize = Math.round(blob.length / 1024) + ' KB';
            if (callback) callback(blob, filesize);
        });


    };

    image.src = imgsrc;
}

//module.exports = TreeChart;
