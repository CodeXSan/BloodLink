import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, useSortBy, useFilters } from 'react-table';
import { Modal, Button, Table as BootstrapTable } from 'react-bootstrap';
import toast from 'react-hot-toast';
import useAuth from '../contexts/AuthContext';
const Requests = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [expiredRequests, setExpiredRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
const [auth] = useAuth()
    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
          const pendingResponse = await axios.get('http://localhost:8080/admin/pending', {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        });
        const acceptedResponse = await axios.get('http://localhost:8080/admin/accepted', {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        });
            const allRequests = [...pendingResponse.data, ...acceptedResponse.data];
            
            const expired = allRequests.filter(request => isExpired(request.requiredDate));
            const nonExpired = allRequests.filter(request => !isExpired(request.requiredDate));
            setPendingRequests(nonExpired.filter(request => request.status === 'Pending'));
            setAcceptedRequests(nonExpired.filter(request => request.status === 'Accepted'));
            setExpiredRequests(expired);
        } catch (error) {
            console.error('Error fetching blood requests:', error);
            toast.error('Error fetching blood requests');
        }
    };

    const isExpired = (requiredDate) => {
        const today = new Date();
        const required = new Date(requiredDate);
        return today > required;
    };

    const columns = React.useMemo(
        () => [
          { Header: 'ID', accessor: 'id' },
          { Header: 'Patient Name', accessor: row => `${row.patientFirstName} ${row.patientLastName}` },
          { Header: 'Blood Group', accessor: 'bloodGroup' },
          { Header: 'Quantity', accessor: 'quantity' },
          { Header: 'Phone Number', accessor: 'phoneNumber' },
          { Header: 'Requested Date', accessor: 'requestDate' },
          { Header: 'Required Date', accessor: 'requiredDate' },
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
        getTableProps: getPendingTableProps,
        getTableBodyProps: getPendingTableBodyProps,
        headerGroups: pendingHeaderGroups,
        rows: pendingRows,
        prepareRow: preparePendingRow,
    } = useTable({ columns, data: pendingRequests }, useFilters, useSortBy);

    const {
        getTableProps: getAcceptedTableProps,
        getTableBodyProps: getAcceptedTableBodyProps,
        headerGroups: acceptedHeaderGroups,
        rows: acceptedRows,
        prepareRow: prepareAcceptedRow,
    } = useTable({ columns, data: acceptedRequests }, useFilters, useSortBy);

    const {
        getTableProps: getExpiredTableProps,
        getTableBodyProps: getExpiredTableBodyProps,
        headerGroups: expiredHeaderGroups,
        rows: expiredRows,
        prepareRow: prepareExpiredRow,
    } = useTable({ columns, data: expiredRequests }, useFilters, useSortBy);

    return (
        <div className="container mt-4">
            <div className='mb-4'>
                <h2>Pending Requests</h2>
                <BootstrapTable striped bordered hover {...getPendingTableProps()}>
                    <thead>
                        {pendingHeaderGroups.map(headerGroup => (
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
                    <tbody {...getPendingTableBodyProps()}>
                        {pendingRows.map(row => {
                            preparePendingRow(row);
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

            <div className='mb-4'>
                <h2>Accepted Requests</h2>
                <BootstrapTable striped bordered hover {...getAcceptedTableProps()}>
                    <thead>
                        {acceptedHeaderGroups.map(headerGroup => (
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
                    <tbody {...getAcceptedTableBodyProps()}>
                        {acceptedRows.map(row => {
                            prepareAcceptedRow(row);
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

            <div className='mb-4'>
                <h2>Expired Requests</h2>
                <BootstrapTable striped bordered hover {...getExpiredTableProps()}>
                    <thead>
                        {expiredHeaderGroups.map(headerGroup => (
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
                    <tbody {...getExpiredTableBodyProps()}>
                        {expiredRows.map(row => {
                            prepareExpiredRow(row);
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

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Request Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRequest && (
                        <div>
                            <p><strong>ID:</strong> {selectedRequest.id}</p>
                            <p><strong>Patient Name:</strong> {selectedRequest.patientFirstName} {selectedRequest.patientLastName}</p>
                            <p><strong>Blood Group:</strong> {selectedRequest.bloodGroup}</p>
                            <p><strong>Date Of Birth:</strong> {selectedRequest.dob}</p>
                            <p><strong>Quantity:</strong> {selectedRequest.quantity} unit</p>
                            <p><strong>Attendee Name:</strong> {selectedRequest.attendeeFirstName} {selectedRequest.attendeeLastName}</p>
                            <p><strong>Phone Number:</strong> {selectedRequest.phoneNumber}</p>
                            <p><strong>Location:</strong> {selectedRequest.address}</p>
                            <p><strong>Status:</strong> {selectedRequest.status}</p>
                            <p><strong>Requested Date:</strong> {selectedRequest.requestDate}</p>
                            <p><strong>Required Date:</strong> {selectedRequest.requiredDate}</p>
                            <p><strong>Note:</strong> {selectedRequest.note || 'N/A'}</p>
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

export default Requests;
