import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryStack } from 'victory-native';

const screenWidth = Dimensions.get('window').width;

const VictoryStackedBarChart = ({ chartDetails, onDrillDown }) => {
    const { title, dateLabels, displayLabels, datasets } = chartDetails;

    // --- STATE TO TRACK THE SELECTED COLUMN ---
    const [selectedDate, setSelectedDate] = useState(null);

    // --- DATA PREPARATION (No changes here) ---
    const inRangeData = displayLabels.map((label, index) => ({
        x: label,
        y: datasets.inRange[index] || 0,
        originalDate: dateLabels[index],
    }));

    const outOfRangeData = displayLabels.map((label, index) => ({
        x: label,
        y: datasets.outOfRange[index] || 0,
        originalDate: dateLabels[index],
    }));

    // Data for the invisible tap overlay
    const totalData = displayLabels.map((label, index) => ({
        x: label,
        y: 100, // Make the tap target fill the full chart height
        originalDate: dateLabels[index],
    }));

    // --- CHART DIMENSIONS (No changes here) ---
    const baseBarWidth = 30;
    const barSpacing = 22;
    const itemWidth = baseBarWidth + barSpacing;
    const chartWidth = Math.max(screenWidth, inRangeData.length * itemWidth + 50);

    // --- UPDATED EVENT HANDLER ---
    const handleBarPress = (event, data) => {
        const dateTapped = data.datum.originalDate;

        // If the user taps the same bar that is already selected, drill down
        if (dateTapped === selectedDate) {
            onDrillDown(dateTapped);
            setSelectedDate(null); // Deselect after drilling down
        } else {
            // Otherwise, just select the new bar
            setSelectedDate(dateTapped);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {/* Legend (No changes here) */}
            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendSymbol, { backgroundColor: 'rgba(175, 214, 177, 1)' }]} />
                    <Text style={styles.legendText}>În Parametrii</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendSymbol, { backgroundColor: 'rgba(211, 132, 132, 1)' }]} />
                    <Text style={styles.legendText}>În Afara Parametrilor</Text>
                </View>
            </View>
            {/* Updated Hint Text */}
            <Text style={styles.drillDownHint}>(Atingeți o coloană pentru a o selecta, apoi încă o dată pentru detalii)</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <VictoryChart
                    width={chartWidth}
                    height={246}
                    padding={{ top: 20, bottom: 42, left: 50, right: 30 }}
                    domainPadding={{ x: 12 }}
                >
                    {/* Y-axis and X-axis (No changes here) */}
                    <VictoryAxis
                        dependentAxis
                        domain={[0, 100]}
                        tickFormat={(t) => `${t}%`}
                        style={{
                            axis: { stroke: 'transparent' },
                            tickLabels: { fontSize: 12, fill: '#666' },
                            grid: { stroke: '#e0e0e0', strokeDasharray: '4, 4' }
                        }}
                    />
                    <VictoryAxis
                        tickValues={displayLabels}
                        style={{ tickLabels: { fontSize: 14, fill: '#333', padding: 5 } }}
                    />

                    {/* Visible Stacked Bars */}
                    <VictoryStack
                        colorScale={['rgba(175, 214, 177, 1)', 'rgba(211, 132, 132, 1)']}
                    >
                        <VictoryBar data={inRangeData} barWidth={baseBarWidth} />
                        <VictoryBar data={outOfRangeData} barWidth={baseBarWidth} />
                    </VictoryStack>

                    {/* Custom % Labels Below Axis (No changes here) */}
                    {inRangeData.map((data) => (
                        <VictoryAxis
                            key={`label-${data.x}`}
                            axisComponent={<View />}
                            tickValues={[data.x]}
                            tickFormat={() => `${Math.round(data.y)}%`}
                            style={{
                                tickLabels: {
                                    fontSize: 14,
                                    fill: '#2e7d32',
                                    fontWeight: 'bold',
                                    padding: 5,
                                    verticalAnchor: 'start',
                                    dy: 17
                                }
                            }}
                        />
                    ))}

                    {/* --- NEW: HIGHLIGHT BAR FOR SELECTED COLUMN --- */}
                    {selectedDate && (
                        <VictoryBar
                            data={totalData.filter(d => d.originalDate === selectedDate)}
                            barWidth={itemWidth - 20}
                            style={{ data: { fill: 'rgba(99, 105, 116, 0.55)' } }}
                        />
                    )}

                    {/* Invisible Overlay Bars for Tapping */}
                    <VictoryBar
                        data={totalData}
                        barWidth={itemWidth - 10}
                        style={{ data: { fill: 'transparent' } }}
                        events={[{
                            target: "data",
                            // USE onPressIn because it fires reliably before a scroll starts
                            eventHandlers: { onPressIn: handleBarPress }
                        }]}
                    />

                </VictoryChart>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { alignItems: 'center', width: '100%' },
    title: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
    drillDownHint: { fontSize: 12, color: '#666', marginBottom: 8, fontStyle: 'italic'},
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 5,
        marginTop: 5,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
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
});

export default VictoryStackedBarChart;