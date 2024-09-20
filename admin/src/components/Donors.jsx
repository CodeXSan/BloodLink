import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import useAuth from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Donors = () => {
    const [auth] = useAuth();
    const [donors, setDonors] = useState([]);
    const [showGraph, setShowGraph] = useState(true);
    const [dateData, setDateData] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])
    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const response = await axios.get('http://localhost:8080/admin/getdonors', {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
                setDonors(response.data);
                setDateData(prepareDateData(response.data));
            } catch (error) {
                console.error(error);
            }
        };
        fetchDonors();
        //eslint-disable-next-line
    }, []);

    const handleSearchResults = (results) => {
        setDonors(results);
    };

    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const getGraphData = () => {
        const data = bloodTypes.map(bloodType => ({
            bloodGroup: bloodType,
            male: donors.filter(donor => donor.bloodGroup === bloodType && donor.gender === 'Male').length,
            female: donors.filter(donor => donor.bloodGroup === bloodType && donor.gender === 'Female').length,
        }));
        return data;
    };
    const getAgeDistributionData = () => {
        const ageGroups = {
            '18-24': 0,
            '25-34': 0,
            '35-44': 0,
            '45-54': 0,
            '55-64': 0,
            '65+': 0,
        };

        donors.forEach(donor => {
            const age = calculateAge(donor.dob);
            if (age >= 18 && age <= 24) ageGroups['18-24'] += 1;
            else if (age >= 25 && age <= 34) ageGroups['25-34'] += 1;
            else if (age >= 35 && age <= 44) ageGroups['35-44'] += 1;
            else if (age >= 45 && age <= 54) ageGroups['45-54'] += 1;
            else if (age >= 55 && age <= 64) ageGroups['55-64'] += 1;
            else if (age >= 65) ageGroups['65+'] += 1;
        });

        return Object.keys(ageGroups).map(ageGroup => ({
            ageGroup,
            count: ageGroups[ageGroup],
        }));
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        return age;
    };
    const prepareDateData = (donors) => {
        const dateCounts = {};

        donors.forEach(donor => {
            const date = new Date(donor.createdDate).toISOString().split('T')[0]; // Format: YYYY-MM-DD
            dateCounts[date] = (dateCounts[date] || 0) + 1;
        });

        return Object.keys(dateCounts).map(date => ({
            date,
            count: dateCounts[date],
        }));
    };


    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className=' mb-4 mt-3'>
                    <Link to="/dashboard/donors/table" className="btn btn-primary">See All Donors</Link>
                    </div>
                    <div>
                        <h2>Gender Distribution of Donors</h2>
                        <BarChart width={1000} height={500} data={getGraphData()} className='mb-4'>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="bloodGroup" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="male" fill="#8884d8" name="Male" />
                            <Bar dataKey="female" fill="#82ca9d" name="Female" />
                        </BarChart>
                        <h2>Age Distribution of Donors</h2>
                        <BarChart width={1000} height={500} data={getAgeDistributionData()}  className='mb-4'>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ageGroup" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                        <h2>Donor Count by Joined Date</h2>
                        <LineChart width={1000} height={600} data={dateData}  className='mb-4'>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#8884d8" />
                        </LineChart>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Donors;