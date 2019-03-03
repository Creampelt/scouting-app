import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

export default class Table extends React.Component {
  tableData = this.props.tableData;
  headerArr = this.props.headers.map((cellData, cellIndex) => (
    <View key={cellIndex} style={styles.cell}>
      <Text style={[styles.cellText, {fontFamily: 'open-sans-bold'}]}>{cellData}</Text>
    </View>
  ));
  tableArr = this.tableData.map((rowData, rowIndex) => (
    <View key={rowIndex} style={styles.row}>
      {rowData.map((cellData, cellIndex) => (
        <View key={cellIndex} style={styles.cell}>
          <Text style={styles.cellText}>{cellData}</Text>
        </View>
      ))}
    </View>
  ));

  render() {
    return (
      <View>
        <View style={styles.row}>{this.headerArr}</View>
        {this.tableArr}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignSelf: 'stretch'
  },
  cell: {
    alignSelf: 'stretch',
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    padding: 3,
  },
  cellText: {
    fontFamily: 'open-sans',
    textAlign: 'center',
    fontSize: 14,
  },
});