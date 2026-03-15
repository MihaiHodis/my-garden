import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, PanResponder } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Svg, Line } from 'react-native-svg';

import VictoryStackedBarChart from './VictoryStackedBarChart'; 

const screenWidth = Dimensions.get('window').width;

const SensorChart = ({ chartDetails, onDrillDown }) => {
    const [tooltip, setTooltip] = useState(null);
    const isPanGesture = useRef(false);

    const updateTooltip = (rawTouchX) => {
        const { dataPoints, outsideDataPoints, labels } = chartDetails;
        if (!dataPoints || dataPoints.length === 0) return;

        const chartWidth = screenWidth - 20;
        const chartHeight = 220;
        const chartPaddingLeft = 62;
        const chartPaddingRight = 10;
        const plotWidth = chartWidth - chartPaddingLeft - chartPaddingRight;

        const allValues = [...dataPoints, ...(outsideDataPoints || []).filter(v => v !== null)].filter(v => v !== null);
        if (allValues.length === 0) return;
        const dataMin = Math.min(...allValues);
        const dataMax = Math.max(...allValues);
        const range = dataMax - dataMin;
        const yAxisMin = dataMin - range * 0.1;
        const yAxisMax = dataMax + range * 0.1;

        const clampedTouchX = Math.max(chartPaddingLeft, Math.min(rawTouchX, chartPaddingLeft + plotWidth));
        let dataIndex = Math.round(((clampedTouchX - chartPaddingLeft) / plotWidth) * (dataPoints.length - 1));
        dataIndex = Math.max(0, Math.min(dataPoints.length - 1, dataIndex));

        const point = dataPoints[dataIndex];
        
        // FIX: This check prevents the app from crashing if 'point' is temporarily
        // null or undefined during a rapid re-render.
        if (point === null || typeof point === 'undefined') {
            setTooltip(null); // Hide tooltip if data is invalid
            return;
        }

        const dotX = chartPaddingLeft + (dataIndex / (dataPoints.length - 1)) * plotWidth;
        const dotY = chartHeight * (1 - (point - yAxisMin) / (yAxisMax - yAxisMin)) + 15;

        setTooltip({
            x: dotX,
            y: dotY,
            value: point.toFixed(1),
            label: labels[dataIndex] || '',
            outsideValue: outsideDataPoints ? (outsideDataPoints[dataIndex] !== null ? outsideDataPoints[dataIndex].toFixed(1) : null) : null,
        });
    };
    
    // --- NO OTHER CHANGES ARE NEEDED IN THIS FILE ---

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                if (chartDetails.type !== 'line') return false;
                const { dx, dy } = gestureState;
                if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) {
                    return true;
                }
                return false;
            },
            onPanResponderTerminationRequest: () => true,
            onPanResponderTerminate: () => {
                isPanGesture.current = false;
                setTooltip(null);
            },
            onPanResponderGrant: (evt, gestureState) => {
                isPanGesture.current = false;
                if (chartDetails && chartDetails.type === 'line') {
                    updateTooltip(gestureState.x0);
                }
            },
            onPanResponderMove: (evt, gestureState) => {
                isPanGesture.current = true;
                if (chartDetails && chartDetails.type === 'line') {
                    updateTooltip(gestureState.moveX);
                }
            },
            onPanResponderRelease: () => {
                if (isPanGesture.current) {
                    setTooltip(null);
                }
            },
        })
    ).current;

    const { type, title, labels, dataPoints, outsideDataPoints, sensorUnit, optimalValueMin, optimalValueMax } = chartDetails;

    if (type === 'bar') {
    return (
        <View style={styles.chartCard}>
            <VictoryStackedBarChart chartDetails={chartDetails} onDrillDown={onDrillDown} />
        </View>
    );
    }

    if (type === 'line') {
        const chartConfig = {
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '5' },
        };

        if (!dataPoints || dataPoints.length === 0) {
            return <Text>Nicio dată de afișat pentru grafic.</Text>;
        }
        
        const allValues = [...dataPoints, ...(outsideDataPoints || []).filter(v => v !== null)].filter(v => v !== null);
        if (allValues.length === 0) return <Text>Date indisponibile.</Text>;

        const dataMin = Math.min(...allValues);
        const dataMax = Math.max(...allValues);
        const range = dataMax - dataMin;
        const yAxisMin = dataMin - range * 0.1;
        const yAxisMax = dataMax + range * 0.1;

        const effectiveOptimalMin = Math.max(parseFloat(optimalValueMin), dataMin);
        const effectiveOptimalMax = Math.min(parseFloat(optimalValueMax), dataMax);

        const chartWidth = screenWidth - 20;
        const chartHeight = 220;
        const chartPaddingLeft = 62; 
        const chartPaddingRight = 10; 
        const plotWidth = chartWidth - chartPaddingLeft - chartPaddingRight;

        const getXLabels = () => {
            if (!labels || labels.length === 0) return [];
            const step = Math.max(1, Math.ceil(labels.length / 8));
            return labels.filter((_, i) => i % step === 0);
        };

        const data = {
            labels: getXLabels(),
            datasets: [
                { data: outsideDataPoints || [], color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, strokeWidth: 2 },
                { data: dataPoints, color: (opacity = 1) => `rgba(175, 214, 177, ${opacity})`, strokeWidth: 2 },
            ],
        };

        return (
            <View style={[styles.chartCard, styles.container]}>
                <Text style={styles.title}>{title}</Text>
                
                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}><View style={[styles.legendSymbol, { backgroundColor: 'rgba(175, 214, 177, 1)', borderRadius: 5 }]} /><Text style={styles.legendText}>{`Senzor (${sensorUnit})`}</Text></View>
                    <View style={styles.legendItem}><View style={[styles.legendSymbol, { backgroundColor: 'rgba(54, 162, 235, 1)', borderRadius: 5 }]} /><Text style={styles.legendText}>{`Vreme (${sensorUnit})`}</Text></View>
                    <View style={styles.legendItem}><View style={[styles.legendSymbol, { borderWidth: 1, borderColor: 'rgba(255, 204, 0, 0.9)' }]} /><Text style={styles.legendText}>Optim</Text></View>
                </View>

                <View>
                    <LineChart
                        data={data}
                        width={chartWidth}
                        height={250}
                        yAxisSuffix={sensorUnit}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chartStyle}
                        yAxisMin={yAxisMin}
                        yAxisMax={yAxisMax}
                        withShadow={false}
                        withInnerLines={true}
                        decorator={() => {
                            if (isNaN(yAxisMin) || isNaN(yAxisMax) || yAxisMax === yAxisMin) return null;
                            const maxLineTop = chartHeight * (1 - (effectiveOptimalMax - yAxisMin) / (yAxisMax - yAxisMin));
                            const minLineTop = chartHeight * (1 - (effectiveOptimalMin - yAxisMin) / (yAxisMax - yAxisMin));
                            
                            return (
                                <View style={{ flex: 1 }}>
                                    {(minLineTop > maxLineTop) && (
                                        <>
                                            <View style={{ position: 'absolute', left: chartPaddingLeft, top: maxLineTop, width: plotWidth, height: minLineTop - maxLineTop, backgroundColor: 'rgba(255, 204, 0, 0.15)' }} />
                                            <View style={[styles.optimalLine, { top: maxLineTop, left: chartPaddingLeft, width: plotWidth }]} />
                                            <View style={[styles.optimalLine, { top: minLineTop, left: chartPaddingLeft, width: plotWidth }]} />
                                        </>
                                    )}

                                    {tooltip && (
                                        <Svg height="250" width={chartWidth} style={{ position: 'absolute', top: 0, left: 0 }}>
                                            <Line x1={tooltip.x} y1="0" x2={tooltip.x} y2="204" stroke="grey" strokeWidth="1" strokeDasharray="3, 3" />
                                        </Svg>
                                    )}
                                </View>
                            );
                        }}
                    />
                    <View style={styles.gestureCaptureView} {...panResponder.panHandlers} />
                </View>
                
                {tooltip && (
                    <View style={[styles.tooltipContainer, { left: tooltip.x > screenWidth / 2 ? tooltip.x - 130 : tooltip.x + 10, top: 20 }]}>
                        <Text style={styles.tooltipLabel}>{tooltip.label}</Text>
                        <View style={styles.tooltipValueContainer}>
                            <View style={[styles.tooltipColorBox, { backgroundColor: 'rgba(175, 214, 177, 1)' }]} />
                            <Text style={styles.tooltipValue}>{tooltip.value}{sensorUnit}</Text>
                        </View>
                        {tooltip.outsideValue && (
                            <View style={styles.tooltipValueContainer}>
                                <View style={[styles.tooltipColorBox, { backgroundColor: 'rgba(54, 162, 235, 1)' }]} />
                                <Text style={styles.tooltipValue}>{tooltip.outsideValue}{sensorUnit}</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        );
    }

    return null;
};

const styles = StyleSheet.create({
    container: { alignItems: 'center', position: 'relative' },
    title: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
    hintText: { fontSize: 12, color: '#666', marginBottom: 8 },
    drillDownHint: { fontSize: 12, color: '#666', marginBottom: 8 },
    chartStyle: { marginVertical: 8 },
    gestureCaptureView: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
    },
    optimalLine: {
        position: 'absolute',
        height: 1,
        borderWidth: 1,
        borderColor: 'rgba(255, 204, 0, 0.7)',
        borderStyle: 'dashed',
    },
    tooltipContainer: {
        position: 'absolute',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 6,
        padding: 8,
        width: 120,
    },
    tooltipLabel: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    tooltipValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
    },
    tooltipColorBox: {
        width: 10,
        height: 10,
        marginRight: 6,
        borderRadius: 2,
    },
    tooltipValue: {
        color: 'white',
        fontSize: 12,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: 5,
        marginTop: 5,
        paddingHorizontal: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginBottom: 5,
    },
    legendSymbol: {
        width: 10,
        height: 10,
        marginRight: 6,
        borderRadius: 2,
    },
    legendText: {
        fontSize: 12,
        color: '#333',
    },
    barLabel: {
        textAlign: 'center',
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    chartCard: {
        marginTop: 7,
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        paddingTop: 16,
        paddingBottom: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        overflow: 'hidden',
    },
});

export default SensorChart;