# MBTInduce Test Branch

This branch is used as an integration and verification branch before merging changes into `main`.

## Purpose

The `test` branch exists to safely combine and verify the frontend and backend before they are merged into the main branch.

Instead of merging changes directly into `main`, all major updates are first merged into `test` so that the full project structure, frontend-backend connection, and overall behavior can be checked in advance.

This helps prevent unexpected errors from being introduced into the production-ready branch.

## Why This Branch Exists

The main reason for this branch is safety.

If changes are merged directly into `main` without prior integration testing, structural issues, broken connections between frontend and backend, or runtime errors may be introduced.  
To avoid that, this branch is used to:

- merge frontend and backend changes first  
- verify that the integrated project works correctly  
- test the overall folder structure and execution flow  
- reduce the risk of breaking the `main` branch  

After confirming that everything works as expected in `test`, the changes are merged into `main`.

## Branch Role

- `frontend`: frontend development branch  
- `backend`: backend development branch  
- `test`: integration and testing branch  
- `main`: final stable branch  

## Project Structure

```bash
MBTInduce/
├── frontend/
├── backend/
├── README.md
└── package.json