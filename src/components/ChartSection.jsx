// src/components/ChartSection.js
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const ChartSection = ({ income, expenses }) => {
  const data = [
    {
      name: 'Income',
      amount: income,
      color: '#4caf50',
      legendFontColor: '#000',
      legendFontSize: 14,
    },
    {
      name: 'Expenses',
      amount: expenses,
      color: '#f44336',
      legendFontColor: '#000',
      legendFontSize: 14,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending Breakdown</Text>
      <PieChart
        data={data}
        width={screenWidth - 40}
        height={180}
        chartConfig={{
          color: () => '#000',
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 0]}
        absolute
      />
    </View>
  );
};

export default ChartSection;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
