import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryStack } from 'victory-native';
import { colors, fonts } from './GlobalStyles/theme';

const screenWidth = Dimensions.get('window').width;

const IN_RANGE_COLOR = 'rgba(74,122,82,1)';   // moss green
const OUT_RANGE_COLOR = 'rgba(192,73,47,1)';  // earthy rust

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
                    <View style={[styles.legendSymbol, { backgroundColor: IN_RANGE_COLOR }]} />
                    <Text style={styles.legendText}>În Parametrii</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendSymbol, { backgroundColor: OUT_RANGE_COLOR }]} />
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
                            tickLabels: { fontSize: 12, fill: colors.textSecondary, fontFamily: fonts.mono },
                            grid: { stroke: 'rgba(30,70,50,0.10)', strokeDasharray: '4, 4' }
                        }}
                    />
                    <VictoryAxis
                        tickValues={displayLabels}
                        style={{ tickLabels: { fontSize: 13, fill: colors.textPrimary, fontFamily: fonts.body, padding: 5 } }}
                    />

                    {/* Visible Stacked Bars */}
                    <VictoryStack
                        colorScale={[IN_RANGE_COLOR, OUT_RANGE_COLOR]}
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
                                    fontSize: 13,
                                    fill: colors.primary,
                                    fontFamily: fonts.monoBold,
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
                            style={{ data: { fill: 'rgba(30,70,50,0.22)' } }}
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
    title: { fontFamily: fonts.display, fontSize: 17, color: colors.primary, marginBottom: 4 },
    drillDownHint: { fontFamily: fonts.body, fontSize: 12, color: colors.textSecondary, marginBottom: 8, fontStyle: 'italic'},
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
        fontFamily: fonts.body,
        fontSize: 12,
        color: colors.textSecondary,
    },
});

export default VictoryStackedBarChart;