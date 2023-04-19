import { useState } from "react";
import { Row, Col, Card, Input, Label } from "reactstrap";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "./components/Table";
import Chart from "./components/Chart";
import data from "./db/dataFake.json";
import Select from "react-select";
import moment from "moment";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const dateRanges = [
	{ label: "Today", value: "today" },
	{ label: "This week", value: "thisWeek" },
	{ label: "This month", value: "thisMonth" },
	{ label: "This year", value: "thisYear" },
	{ label: "Specific date", value: "specificDate" },
];

function App() {
	const [selectedDateRange, setSelectedDateRange] = useState(dateRanges[0]);
	const [dateRange, setDateRange] = useState([]);

	const handleSelector = (selectedOption) => {
		setSelectedDateRange(selectedOption);
	};

	const handleDateRangeChange = (selectedDates) => {
		setDateRange(selectedDates);
	};
	const getStartDate = () => {
		switch (selectedDateRange.value) {
			case "today":
				return moment().startOf("day").format("YYYY-MM-DD");
			case "thisWeek":
				return moment().startOf("week").format("YYYY-MM-DD");
			case "thisMonth":
				return moment().startOf("month").format("YYYY-MM-DD");
			case "thisYear":
				return moment().startOf("year").format("YYYY-MM-DD");
			case "specificDate":
				return moment(dateRange[0]).format("YYYY-MM-DD");
			default:
				return null;
		}
	};

	const getEndDate = () => {
		switch (selectedDateRange.value) {
			case "today":
				return moment().endOf("day").format("YYYY-MM-DD");
			case "thisWeek":
				return moment().endOf("week").format("YYYY-MM-DD");
			case "thisMonth":
				return moment().endOf("month").format("YYYY-MM-DD");
			case "thisYear":
				return moment().endOf("year").format("YYYY-MM-DD");
			case "specificDate":
				return moment(dateRange[1]).format("YYYY-MM-DD");
			default:
				return null;
		}
	};

	const filteredData = data.filter((item) => {
		const date = moment(item.date);
		return date.isBetween(getStartDate(), getEndDate(), null, "[]");
	});

	return (
		<div class="container-fluid w-100">
			<div class="row">
				<h1 class="h2">Dashboard</h1>
				<Row className="mb-2">
					<Col sm="12">
						<Card body className="shadow-sm">
							<Row className="g-5 align-items-center">
								<Col>
									<Label for="examplePassword">Date</Label>
									<Select options={dateRanges} value={selectedDateRange} onChange={handleSelector} style={{ width: "200px" }} />
									{selectedDateRange.value === "specificDate" && <Flatpickr value={dateRange} options={{ mode: "range", dateFormat: "Y-m-d" }} onChange={handleDateRangeChange} />}
								</Col>
							</Row>
						</Card>
					</Col>
				</Row>
				<Chart filter={selectedDateRange} data={filteredData} range={dateRange} />
				<Table />
			</div>
		</div>
	);
}

export default App;
