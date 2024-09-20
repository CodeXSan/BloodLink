import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, useSortBy, useFilters } from 'react-table';
import { Modal, Button, Form, Table as BootstrapTable } from 'react-bootstrap';
import toast from 'react-hot-toast';
import useAuth from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';

const DonorsTable = () => {
    const [auth] = useAuth();
    const [donors, setDonors] = useState([]);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const response = await axios.get('http://localhost:8080/admin/getdonors', {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
                setDonors(response.data);
            } catch (error) {
                toast.error('There was an error fetching the donors!');
            }
        };
        fetchDonors();
    }, [auth.token]);

    useEffect(() => {
        const fetchProfilePicture = async () => {
            if (!selectedDonor || !selectedDonor.profilePicture) {
                return;
            }
            try {
                const response = await axios.get(`http://localhost:8080/donor/profile-picture/${selectedDonor.profilePicture}`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                    responseType: 'arraybuffer',
                });

                if (response.status === 200) {
                    const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
                    const imageUrl = URL.createObjectURL(imageBlob);
                    setProfilePicture(imageUrl);
                } else {
                    toast.error('Failed to load profile picture');
                }
            } catch (error) {
                console.error('Error fetching profile picture:', error);
                toast.error('Error loading profile picture');
            }
        };
        fetchProfilePicture();
    }, [auth.token, selectedDonor]);

    const columns = React.useMemo(
        () => [
            { Header: 'ID', accessor: 'id' },
            { Header: 'First Name', accessor: 'firstName' },
            { Header: 'Last Name', accessor: 'lastName' },
            { Header: 'Email', accessor: 'email' },
            { Header: 'Phone', accessor: 'phoneNumber' },
            { Header: 'Blood Group', accessor: 'bloodGroup' },
            { Header: 'Address', accessor: 'address' },
            { Header: 'DOB', accessor: 'dob' },
            { Header: 'Last Donation Date', accessor: 'lastDonationDate' },
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

    const isExpired = (requiredDate) => {
        const today = new Date();
        const required = new Date(requiredDate);
        return today > required;
      };

    const handleView = (donor) => {
        setSelectedDonor(donor);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDonor(null);
        setProfilePicture(null);
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setFilter,
    } = useTable({ columns, data: donors }, useFilters, useSortBy);

    const renderFilterInput = (column) => (
        <Form.Control
            size="sm"
            type="text"
            placeholder={`Filter ${column.Header}`}
            value={column.filterValue || ''}
            onChange={(e) => column.setFilter(e.target.value || undefined)}
        />
    );

    return (
        <div className="container mt-4">
            <div className='text-left mb-4 mt-3'>
                <Link to="/dashboard/donors" className="btn btn-primary fw-bold"><FaArrowLeft /> Back to Graph</Link>
            </div>
            <BootstrapTable striped bordered hover {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                    </span>
                                    <div>{column.canFilter ? renderFilterInput(column) : null}</div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </BootstrapTable>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Donor Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedDonor && (
                        <div>
                           {profilePicture ? (
    <img 
        src={profilePicture} 
        alt="Profile" 
        style={{ 
            display: 'block', 
            margin: 'auto', 
            width: '150px', 
            height: '150px', 
            borderRadius: '50%', 
            objectFit: 'cover' 
        }} 
    />
) : (
    <div 
        style={{
            display: 'block',
            margin: 'auto',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            backgroundColor: '#f0f0f0',
            textAlign: 'center',
            lineHeight: '150px',
            color: '#888',
            fontSize: '24px'
        }}
    >
        No Image
    </div> )}
                            <p><strong>ID:</strong> {selectedDonor.id}</p>
                            <p><strong>First Name:</strong> {selectedDonor.firstName}</p>
                            <p><strong>Last Name:</strong> {selectedDonor.lastName}</p>
                            <p><strong>Email:</strong> {selectedDonor.email}</p>
                            <p><strong>Phone Number:</strong> {selectedDonor.phoneNumber}</p>
                            <p><strong>Blood Group:</strong> {selectedDonor.bloodGroup}</p>
                            <p><strong>Address:</strong> {selectedDonor.address}</p>
                            <p><strong>Date of Birth:</strong> {selectedDonor.dob}</p>
                            <p><strong>Last Donation Date:</strong> {selectedDonor.lastDonationDate || 'N/A'}</p>
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

export default DonorsTable;
