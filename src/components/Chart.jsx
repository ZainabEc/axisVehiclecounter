import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, Col, Row, Label, FormGroup, Input } from "reactstrap";
import moment from "moment";

function countCarsByDate(date, data) {
	const result = {
		day: moment(date).format("DD/MM"),
		north: 0,
		east: 0,
		west: 0,
		south: 0,
		total: 0,
	};
	data.forEach((item) => {
		const itemDate = moment(item.date);
		if (itemDate.isSame(date, "day")) {
			if (item.directionNorth) result.north++;
			if (item.directionEast) result.east++;
			if (item.directionWest) result.west++;
			if (item.directionSouth) result.south++;
			result.total++;
		}
	});
	return [result];
}

function countCarsByDirection(data) {
	const counts = [
		{ day: "Monday", north: 0, east: 0, west: 0, south: 0, total: 0 },
		{ day: "Tuesday", north: 0, east: 0, west: 0, south: 0, total: 0 },
		{ day: "Wednesday", north: 0, east: 0, west: 0, south: 0, total: 0 },
		{ day: "Thursday", north: 0, east: 0, west: 0, south: 0, total: 0 },
		{ day: "Friday", north: 0, east: 0, west: 0, south: 0, total: 0 },
		{ day: "Saturday", north: 0, east: 0, west: 0, south: 0, total: 0 },
		{ day: "Sunday", north: 0, east: 0, west: 0, south: 0, total: 0 },
	];

	data.forEach(({ date, directionNorth, directionEast, directionWest, directionSouth }) => {
		const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
		const count = counts.find((c) => c.day === dayOfWeek);
		if (directionNorth) count.north++;
		if (directionEast) count.east++;
		if (directionWest) count.west++;
		if (directionSouth) count.south++;
		count.total++;
	});

	return counts;
}

function countCarsByDateOfMonth(data) {
	const daysInMonth = moment().daysInMonth();
	const result = [];
	for (let i = 1; i <= daysInMonth; i++) {
		const dateData = {
			day: moment().date(i).format("DD/MM"),
			north: 0,
			east: 0,
			west: 0,
			south: 0,
			total: 0,
		};
		data.forEach((item) => {
			const date = moment(item.date);
			if (date.date() === i) {
				if (item.directionNorth) dateData.north++;
				if (item.directionEast) dateData.east++;
				if (item.directionWest) dateData.west++;
				if (item.directionSouth) dateData.south++;
				dateData.total++;
			}
		});
		result.push(dateData);
	}
	return result;
}

function countCarsByDirectionAndMonth(data) {
	const counts = Array.from({ length: 12 }, (_, i) => ({
		month: i + 1,
		day: new Date(2021, i).toLocaleString("en-us", { month: "long" }),
		north: 0,
		east: 0,
		west: 0,
		south: 0,
		total: 0,
	}));

	data.forEach(({ date, directionNorth, directionEast, directionWest, directionSouth }) => {
		const month = new Date(date).getMonth();
		const count = counts[month];
		if (directionNorth) count.north++;
		if (directionEast) count.east++;
		if (directionWest) count.west++;
		if (directionSouth) count.south++;
		count.total++;
	});

	return counts;
}

function countCarsByDateOfRange(data, range) {
	const start = moment(range[0]);
	const end = moment(range[1]);
	const result = [];

	// Iterate over each day in the date range
	for (let date = start.clone(); date <= end; date.add(1, "days")) {
		const dateData = {
			day: date.format("DD/MM"),
			north: 0,
			east: 0,
			west: 0,
			south: 0,
			total: 0,
		};

		// Count the cars for each direction for the current day
		data.forEach((item) => {
			const itemDate = moment(item.date);
			if (itemDate.isSame(date, "day")) {
				if (item.directionNorth) dateData.north++;
				if (item.directionEast) dateData.east++;
				if (item.directionWest) dateData.west++;
				if (item.directionSouth) dateData.south++;
				dateData.total++;
			}
		});

		result.push(dateData);
	}

	return result;
}

const Chart = ({ filter, data, range }) => {
	const [isNorthChecked, setIsNorthChecked] = useState(false);
	const [isEastChecked, setIsEastChecked] = useState(false);
	const [isWestChecked, setIsWestChecked] = useState(false);
	const [isSouthChecked, setIsSouthChecked] = useState(false);

	const handleNorthCheckboxChange = () => {
		setIsNorthChecked(!isNorthChecked);
	};

	const handleEastCheckboxChange = () => {
		setIsEastChecked(!isEastChecked);
	};

	const handleWestCheckboxChange = () => {
		setIsWestChecked(!isWestChecked);
	};

	const handleSouthCheckboxChange = () => {
		setIsSouthChecked(!isSouthChecked);
	};

	const filteredData = () => {
		switch (filter.value) {
			case "today":
				return countCarsByDate(moment(), data);
			case "thisWeek":
				return countCarsByDirection(data);
			case "thisMonth":
				return countCarsByDateOfMonth(data);
			case "thisYear":
				return countCarsByDirectionAndMonth(data);
			case "specificDate":
				if (Object.keys(range).length == 2) return countCarsByDateOfRange(data, range);
			default:
				return data;
		}
	};
	return (
		<Card body className="shadow-sm my-2">
			<Row>
				<Col sm={10}>
					<div className="h2">{filter.label.toString()}</div>
					<ResponsiveContainer width="100%" height={400}>
						<LineChart
							data={filteredData()}
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="day" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
							{isNorthChecked && <Line type="monotone" dataKey="north" stroke="#82ca9d" />}
							{isSouthChecked && <Line type="monotone" dataKey="south" stroke="#FFFF00" />}
							{isWestChecked && <Line type="monotone" dataKey="west" stroke="#812a9d" />}
							{isEastChecked && <Line type="monotone" dataKey="east" stroke="#FF0000" />}
						</LineChart>
					</ResponsiveContainer>
				</Col>
				<Col sm={2}>
					<Row className="justify-content-center">
						<FormGroup check>
							<Input color="red" id="northCheckbox" name="north" type="checkbox" checked={isNorthChecked} onChange={handleNorthCheckboxChange} />
							<Label check for="northCheckbox">
								North
							</Label>
						</FormGroup>
						<FormGroup check>
							<Input id="eastCheckbox" name="east" type="checkbox" checked={isEastChecked} onChange={handleEastCheckboxChange} />
							<Label check for="eastCheckbox">
								East
							</Label>
						</FormGroup>
						<FormGroup check>
							<Input id="westCheckbox" name="west" type="checkbox" checked={isWestChecked} onChange={handleWestCheckboxChange} />
							<Label check for="westCheckbox">
								West
							</Label>
						</FormGroup>
						<FormGroup check>
							<Input id="southCheckbox" name="south" type="checkbox" checked={isSouthChecked} onChange={handleSouthCheckboxChange} />
							<Label check for="southCheckbox">
								South
							</Label>
						</FormGroup>
					</Row>
				</Col>
			</Row>
		</Card>
	);
};

export default Chart;
