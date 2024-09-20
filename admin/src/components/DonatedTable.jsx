import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, useSortBy, useFilters } from 'react-table';
import { Modal, Button, Table as BootstrapTable } from 'react-bootstrap';
import toast from 'react-hot-toast';
import useAuth from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';

const DonatedTable = () => {
    const [auth] = useAuth();
    const [donatedRequests, setDonatedRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchDonatedRequests = async () => {
            try {
                const response = await axios.get('http://localhost:8080/blood/donated', {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
                setDonatedRequests(response.data);
                console.log(donatedRequests)
            } catch (error) {
                toast.error('Error fetching donated requests');
            }
        };
        fetchDonatedRequests();
    }, [auth.token]);

    const columns = React.useMemo(
        () => [
            { Header: 'ID', accessor: 'id' },
            { Header: 'Patient Name', accessor: row => `${row.patientFirstName} ${row.patientLastName}` },
            { Header: 'Donor Name', accessor: row => row.acceptedBy ? `${row.acceptedBy.firstName} ${row.acceptedBy.lastName}` : 'N/A' },
            { Header: 'Blood Group', accessor: 'bloodGroup' },
            { Header: 'Location', accessor: 'address' },
            { Header: 'Donation Date', accessor: 'donatedDate' },
            {
                Header: 'Actions',
                Cell: ({ row }) => (
                    <Button variant="primary" onClick={() => handleView(row.original)}>
                        View
                    </Button>
                ),
            },
        ],
        []
    );

    const handleView = (request) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRequest(null);
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: donatedRequests }, useFilters, useSortBy);

    return (
        <div className="container mt-4">
            <h2>Donated Requests</h2>
            <BootstrapTable striped bordered hover {...getTableProps()}>
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

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Donation Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRequest && (
                        <div>
                            <p><strong>ID:</strong> {selectedRequest.id}</p>
                            <p><strong>Patient Name:</strong> {selectedRequest.patientFirstName} {selectedRequest.patientLastName}</p>
                            <p><strong>Attendee Name:</strong> {selectedRequest.attendeeFirstName} {selectedRequest.attendeeLastName}</p>
                            <p><strong>Attendee Phone Number:</strong> {selectedRequest.phoneNumber}</p>
                            <p><strong>Donor Name:</strong> {selectedRequest.acceptedBy.firstName} {selectedRequest.acceptedBy.lastName}</p>
                            <p><strong>Donor Phone Number:</strong> {selectedRequest.acceptedBy.phoneNumber}</p>
                            <p><strong>Donor Address:</strong> {selectedRequest.acceptedBy.address}</p>
                            <p><strong>Blood Group:</strong> {selectedRequest.bloodGroup}</p>
                            <p><strong>Location:</strong> {selectedRequest.address}</p>
                            <p><strong>Required Date:</strong> {selectedRequest.requiredDate}</p>
                            <p><strong>Donation Date:</strong> {selectedRequest.donatedDate}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DonatedTable;
