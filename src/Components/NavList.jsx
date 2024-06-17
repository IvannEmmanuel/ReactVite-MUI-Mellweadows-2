import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { Link } from 'react-router-dom';

const styles = { textDecoration: "none", color: "inherit" }

export const mainListItems = (
    <React.Fragment>
        <Link to="/dashboard" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/patientform" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Patient Registration" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/staffregistration" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Staff Registration" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/wardrequisition" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Ward Request" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/appointment" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Appointment" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/ward" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Ward Management" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/supplies" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Supplies" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/pharmaceutical" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Pharmaceutical Supply" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/surgical" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Non/Surgical Supply" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/staffmanagement" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Staff Management" />
            </ListItemButton>
        </Link>
    </React.Fragment>
);