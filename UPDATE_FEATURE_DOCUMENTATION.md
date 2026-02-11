# Oil Order Update Feature Implementation

## Overview
Implemented a complete update functionality for oil orders in the home component. When users click the action button in the order list table, a modal form opens allowing them to update various order details.

## Changes Made

### 1. Backend Integration (`oil.service.ts`)
Added two new methods to the OilService:
- `getOilOrderById(id: number)`: Fetches a single oil order by ID from `api/OilSale/{id}`
- `updateOilOrder(id: number, updateData: FormData)`: Updates an oil order using `PUT api/OilSale/{id}`

### 2. Component Logic (`home.ts`)
Added the following properties and methods:
- **Properties:**
  - `showUpdateModal`: Boolean to control modal visibility
  - `selectedOrder`: Stores the currently selected order for editing

- **Methods:**
  - `openUpdateModal(order)`: Fetches order details from API and opens the modal
  - `closeUpdateModal()`: Closes the modal and clears selected order
  - `onFileSelect(event)`: Handles file selection for oil image upload
  - `onUpdateFormSubmit(formData)`: Submits the update form to the backend API

### 3. HTML Template (`home.html`)
- Added click handler `(click)="openUpdateModal(order)"` to the action button in the order table
- Created a comprehensive modal form with the following fields:
  - Status (dropdown)
  - Payment (dropdown)
  - Unit Price (number input)
  - Amount (number input)
  - Payment Method (dropdown)
  - Quantity (number input)
  - Agent ID (number input)
  - Vendor ID (number input)
  - Vendor Status (dropdown)
  - Oil Quality (text input)
  - Timeline (date input)
  - Remarks (textarea)
  - Reason (textarea)
  - Oil Image (file upload)

### 4. Styling (`home.scss`)
Added comprehensive modal styles including:
- Modal overlay with semi-transparent background
- Centered modal content with max-width of 800px
- Responsive grid layout for form fields (2 columns on desktop, 1 on mobile)
- Professional form styling with focus states
- Modal header with close button
- Modal footer with Cancel and Update buttons

## API Integration Details

### Backend Endpoint
- **Endpoint:** `PUT /api/OilSale/{id}`
- **Content-Type:** `multipart/form-data` (for file upload support)
- **Authentication:** Required (role-based access control)

### Request Fields (from UpdateOilSaleRequestDTO)
All fields are optional and only sent if they have values:
- Status
- Payment
- UnitPrice (decimal)
- Amount (decimal)
- PaymentMethod
- AgentId (integer)
- VendorId (integer)
- VendorStatus
- Remarks
- Reason
- OilQuality
- Timeline (date string)
- Quantity (integer)
- OilImage (file)
- PaymentDate (datetime)

### Response
- **Success:** `{ message: "Oil sale request successfully updated.", status: "success" }`
- **Error:** `{ message: "Error message", status: "error" }`

## User Flow

1. User views the order list table on the home page
2. User clicks the action button (arrow icon) for a specific order
3. System fetches the full order details from the API
4. Modal opens with form pre-populated with current order data
5. User modifies desired fields
6. User clicks "Update Order" button
7. System submits the form data to the backend API
8. On success:
   - Alert shows "Order updated successfully!"
   - Modal closes
   - Order list refreshes to show updated data
9. On error:
   - Alert shows "Failed to update order. Please try again."
   - Modal remains open for user to retry

## Features

### Data Fetching
- When modal opens, fresh data is fetched from the API to ensure accuracy
- Fallback to table data if API call fails
- Loading states handled gracefully

### Form Validation
- All fields are optional (backend handles validation)
- Proper input types for each field (number, date, text, file)
- Dropdown menus for predefined values (status, payment method, etc.)

### File Upload
- Supports oil image upload
- File is included in FormData submission
- Accepts image files only

### Responsive Design
- Modal is fully responsive
- Form grid adjusts from 2 columns (desktop) to 1 column (mobile)
- Touch-friendly on mobile devices

## Files Modified

1. `src/app/services/oil.service.ts` - Added API methods
2. `src/app/home/home.ts` - Added component logic
3. `src/app/home/home.html` - Added modal HTML and button handler
4. `src/app/home/home.scss` - Added modal styles

## Testing Recommendations

1. Test with different order statuses
2. Test file upload functionality
3. Test form validation
4. Test API error handling
5. Test on different screen sizes
6. Test with different user roles (if applicable)

## Future Enhancements

1. Add form validation feedback
2. Add loading spinner during API calls
3. Add confirmation dialog before updating
4. Add field-level validation messages
5. Add ability to preview uploaded image
6. Add audit trail for order updates
