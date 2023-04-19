import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Card, CardImg, CardBody, CardText, Row, Col, Input, Label, Modal, ModalBody } from "reactstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";

import data from "../db/dataFake.json";
const columns = [
	{
		name: "id",
		selector: "id",
	},
	{
		name: "Vehicle Number",
		selector: "vehicleNumber",
	},
	{
		name: "Date",
		selector: "date",
	},
	{
		name: "Speed",
		selector: "speed",
	},
	{
		name: "Direction",
		selector: "direction",

		format: (row) => {
			const directions = [];
			if (row.directionNorth) {
				directions.push("North");
			}
			if (row.directionWest) {
				directions.push("West");
			}
			if (row.directionEast) {
				directions.push("East");
			}
			if (row.directionSouth) {
				directions.push("South");
			}
			return directions.join(", ");
		},
	},
];

const Table = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState(null);
	const [vehicles, setVehicles] = useState([]);
	const [dateFilter, setDateFilter] = useState("");
	const [speedFilter, setSpeedFilter] = useState("");
	const [vehicleFilter, setVehicleFilter] = useState("");

	useEffect(() => {
		// This would be replaced by your actual API call to get the data

		// Filter the data based on the current filter values
		const filteredData = data.filter(function (vehicle) {
			// Check if the date filter matches (or if no date filter is set)
			if (!dateFilter || vehicle.date === dateFilter) {
				// Check if the speed filter matches (or if no speed filter is set)
				if (!speedFilter || vehicle.speed == speedFilter) {
					// Check if the vehicle ID filter matches (or if no vehicle ID filter is set)
					if (!vehicleFilter || vehicle.vehicleNumber.toLowerCase().includes(vehicleFilter.toLowerCase())) {
						return true;
					}
				}
			}
			return false;
		});

		setVehicles(filteredData);
	}, [dateFilter, speedFilter, vehicleFilter]);

	const handleDateFilterChange = (event) => {
		setDateFilter(event.target.value);
	};

	const handleSpeedFilterChange = (event) => {
		setSpeedFilter(event.target.value);
	};

	const handleVehicleFilterChange = (event) => {
		setVehicleFilter(event.target.value);
	};

	const handleRowClick = (row) => {
		setIsOpen(true);
		setSelected(row);
	};

	const handleClose = () => {
		setIsOpen(false);
		setSelected(null);
	};

	return (
		<Card body className="shadow-sm my-2">
			<h2>Table</h2>
			<Row className="g-5 align-items-center mb-3">
				<Col>
					<Label for="exampleEmail">Vehicle Number</Label>
					<Input id="exampleEmail" name="email" placeholder="ABC123" type="email" onChange={handleVehicleFilterChange} />
				</Col>
				<Col>
					<Label for="examplePassword">Speed</Label>
					<Input id="examplePassword" name="text" placeholder="50-120" onChange={handleSpeedFilterChange} />
				</Col>
				<Col>
					<Label for="examplePassword">Date</Label>
					<Input id="exampleDate" name="date" placeholder="date placeholder" type="date" onChange={handleDateFilterChange} />
				</Col>
			</Row>
			<DataTable theme="default" columns={columns} data={vehicles} onRowClicked={handleRowClick} highlightOnHover pointerOnHover pagination></DataTable>
			<Modal isOpen={isOpen} toggle={handleClose}>
				<ModalBody className="p-4">
					<CardImg
						alt="Card image cap"
						src={selected?.imageUrl}
						style={{
							height: 180,
						}}
						top
						width="100%"
					/>
					<CardBody className="p-4">
						<CardText>
							<small className="text-muted">Vehicle number : {selected?.vehicleNumber}</small>
						</CardText>
						{selected?.directionEast && (
							<CardText>
								<small className="text-muted">Direction : East</small>
							</CardText>
						)}
						{selected?.directionNorth && (
							<CardText>
								<small className="text-muted">Direction : North</small>
							</CardText>
						)}
						{selected?.directionSouth && (
							<CardText>
								<small className="text-muted">Direction : South</small>
							</CardText>
						)}
						{selected?.directionWest && (
							<CardText>
								<small className="text-muted">Direction : West</small>
							</CardText>
						)}
						<CardText>
							<small className="text-muted">Speed : {selected?.speed}</small>
						</CardText>
						<CardText>
							<small className="text-muted">Date : {selected?.date}</small>
						</CardText>
					</CardBody>
				</ModalBody>
			</Modal>
		</Card>
	);
};

export default Table;
