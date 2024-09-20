import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, useSortBy } from 'react-table';
import { Table as BootstrapTable, Container, Row, Col, Alert } from 'react-bootstrap';
import useAuth from '../../contexts/AuthContext';

function DonationHistory() {
  const [auth] = useAuth();
  const [donationHistory, setDonationHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonationHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/blood/donationhistory/${auth.user.id}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setDonationHistory(response.data);
      } catch (err) {
        setError('Error fetching donation history.');
      }
    };

    fetchDonationHistory();
  }, [auth.token]);

  // Define columns for react-table
  const columns = React.useMemo(
    () => [
      { Header: 'DonatedDate', accessor: 'donatedDate' },
      { Header: 'Patient Name', accessor: (row) => `${row.patientFirstName} ${row.patientLastName}` },
      { Header: 'Attendee Name', accessor: (row) => `${row.attendeeFirstName} ${row.attendeeLastName}` },
      { Header: 'Blood Group', accessor: 'bloodGroup' },
      { Header: 'Quantity', accessor: 'quantity' },
      { Header: 'Address', accessor: 'address' },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: donationHistory }, useSortBy);

  return (
    <Container fluid>
      <Row>
        <Col>
          <h3>Donation History</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <div className="table-responsive">
            <BootstrapTable
              striped
              bordered
              hover
              {...getTableProps()}
              className="table table-bordered table-striped table-hover"
              style={{ width: '100%' }}
            >
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {column.render('Header')}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? ' 🔽'
                              : ' 🔼'
                            : ''}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </BootstrapTable>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default DonationHistory;
