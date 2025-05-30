import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  Select,
  TextContainer,
  Box,
  Link,
  ProgressBar,
  DataTable,
  Spinner,
  TextField,
  InlineGrid,
  Toast
} from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';
import { RefreshIcon } from '@shopify/polaris-icons';

interface AnalysisResult {
  sku: string;
  title: string;
  stock: number;
}

interface SkuLocation {
  mumbai: number | string;
  uniqueSpareWarehouse: number | string;
}

interface SkuItem {
  id: number;
  title: string;
  productId: string; // Add this property
  variantId: string;
  locations: SkuLocation;
}

interface SkuGroup {
  id: number;
  sku: string;
  items: SkuItem[];
}

export default function AnalyzeProductsPage() {
  const [selectedSkuOption, setSelectedSkuOption] = useState('all');
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [variantsScanned, setVariantsScanned] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [totalVariants, setTotalVariants] = useState(300); // Mock total count
  const [duplicateFilterType, setDuplicateFilterType] = useState('all');
  const [searchSku, setSearchSku] = useState('');
  const [filteredSkus, setFilteredSkus] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Add new state for tracking inventory updates
  const [inventoryUpdates, setInventoryUpdates] = useState<{[key: string]: {[location: string]: string}}>({});
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Add stock update functionality to each inventory cell

  // Add this new CSS to your shopifyTableStyles
  const shopifyTableStyles = `
    /* Table container styling */
    .shopify-like-table {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(63, 63, 68, 0.15);
      background: white;
      border: 1px solid #dfe3e8;
      margin-bottom: 32px; /* Updated to 32px from 24px to match Shopify */
    }

    /* Table headers with darker border */
    .Polaris-DataTable__Heading {
      background-color: #f4f6f8 !important;  /* Shopify admin background color */
      border-bottom: 1px solid #babfc3 !important; /* Darker border color */
      font-weight: 600 !important;
      font-size: 12px !important;
      color: #202223;
      height: 54px;
      vertical-align: middle;
    }

    /* Also update the header row styles */
    .Polaris-DataTable__Table thead tr {
      background-color: #f4f6f8 !important;
    }

    /* Make header border darker */
    .Polaris-DataTable__Table thead th {
      border-bottom: 1px solid #babfc3 !important;
    }

    /* Also update the header row styles */
    .Polaris-DataTable__Table thead tr {
      background-color: #f4f6f8 !important;
    }

    /* And ensure the sku-header-row matches this color */
    .sku-header-row {
      width: 100%;
      padding: 8px 0;
      background-color: #f4f6f8;
      position: relative;
      z-index: 1;
    }

    /* Update the row background color too */
    tr.Polaris-DataTable__Row:has(.sku-header-row) {
      background-color: #f4f6f8 !important;
    }

    .Polaris-DataTable__Row:has(.sku-header-row) .Polaris-DataTable__Cell {
      background-color: #f4f6f8 !important;
      border-bottom: 1px solid #dfe3e8 !important;
    }

    /* Table cells */
    .Polaris-DataTable__Cell {
      padding: 16px !important;
      border-bottom: 1px solid #f1f1f1;
      vertical-align: middle;
    }
    
    /* Hover effect for rows */
    .Polaris-DataTable__Row:hover .Polaris-DataTable__Cell {
      background-color: rgba(180, 188, 199, 0.05);
    }

    /* Product detail cell */
    .product-detail-cell {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    /* Product thumbnail */
    .product-thumbnail {
      width: 48px;
      height: 48px;
      border-radius: 4px;
      border: 1px solid #dfe3e8;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }

    /* Inventory status cell */
    .inventory-status {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-weight: 500;
      font-size: 12px;
      line-height: 1;
      text-align: center;
      background: transparent;
    }
    
    .inventory-status.in-stock {
      color: #202223; /* Black color for 10+ items */
    }
    
    .inventory-status.low-stock {
      color: #d82c0d; /* Red color for 0-9 items */
    }

    /* Update button */
    .shopify-update-btn {
      font-size: 14px;
      color: #006fbb;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px 8px;
      margin-left: 8px;
      border-radius: 4px;
    }
    
    .shopify-update-btn:hover {
      background-color: rgba(0, 111, 187, 0.05);
    }
    
    /* Refresh button */
    .shopify-refresh-btn {
      font-size: 14px;
      color: #202223;
      background-color: #f6f6f7;
      border: 1px solid #c9cccf;
      border-radius: 4px;
      padding: 6px 12px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }
    
    .shopify-refresh-btn:hover {
      background-color: #f1f2f3;
    }

    /* Input field */
    .shopify-input {
      width: 70px;
      padding: 8px;
      border: 1px solid #c9cccf;
      border-radius: 4px;
      text-align: center;
    }

    /* Quantity box styling */
    .shopify-quantity-box {
      display: inline-block;
      position: relative;
      max-width: 220px;
      width: 100%;
      margin: 0 auto;
    }

    .shopify-quantity-input {
      width: 100%;
      height: 36px;
      border: 1px solid #c9cccf;
      border-radius: 4px;
      text-align: left;
      padding: 0 12px;
      font-size: 14px;
      color: #202223;
      outline: none;
      background: white;
    }

    .shopify-quantity-input:focus {
      border-color: #2c6ecb;
      box-shadow: 0 0 0 1px #2c6ecb;
      outline: none;
    }

    .shopify-quantity-input::placeholder {
      color: #6d7175;
    }

    .inventory-label {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 100%;
      font-weight: 500;
    }

    /* Improved bottom spacing for cards */
    .Polaris-Card:last-child {
      margin-bottom: 32px; /* Updated to match Shopify's more spacious feel */
    }

    /* Editable stock value styling */
    .stock-value-wrapper {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      min-width: 60px;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .stock-value-wrapper:hover {
      background-color: rgba(0, 111, 187, 0.05);
    }
    
    /* When hovered, show a chevron dropdown icon */
    .stock-value-wrapper::after {
      content: '';
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid #637381;
      opacity: 0; /* Hide by default */
      transition: opacity 0.2s ease;
    }

    .stock-value-wrapper:hover::after {
      opacity: 1; /* Show on hover */
    }

    /* New styles for quantity dropdown */
    .stock-value-wrapper:hover .quantity-arrows {
      opacity: 1;
    }

    .quantity-arrows {
      position: absolute;
      right: -5px;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0;
      transition: opacity 0.2s ease;
      display: flex;
      flex-direction: column;
      background: #fff;
      border: 1px solid rgb(10, 72, 134); /* Fixed the missing space between 'solid' and 'rgb' */
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .quantity-arrow {
      padding: 2px;
      cursor: pointer;
    }

    .quantity-arrow:hover {
      background-color: #f6f6f7;
    }

    .quantity-popup {
      position: absolute;
      top: calc(100% + 5px);
      left: 0;
      background: white;
      border-radius: 8px;
      box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05), 0 1px 3px 0 rgba(63, 63, 68, 0.15), 0 10px 20px 0 rgba(63, 63, 68, 0.15);
      padding: 16px;
      z-index: 50;
      min-width: 220px;
      text-align: left;
    }

    .quantity-adjustment-fields {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }

    .quantity-field {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .quantity-field-label {
      font-size: 13px;
      font-weight: 500;
      color: #202223;
      margin-bottom: 4px;
    }

    .quantity-input {
      width: 100%;
      height: 36px;
      padding: 0 12px;
      border: 1px solid #c9cccf;
      border-radius: 4px;
      font-size: 14px;
      color: #202223;
    }

    .quantity-input:focus {
      border-color: #2c6ecb;
      box-shadow: 0 0 0 1px #2c6ecb;
      outline: none;
    }

    .quantity-popup-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    /* Polaris TextField Spinner styles */
    .Polaris-TextField__Spinner {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      width: 22px;
      background: white;
      border-left: 1px solid transparent;
      z-index: 1;
    }

    .Polaris-TextField__Segment {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      height: 50%;
    }

    .Polaris-TextField__Segment:hover {
      background-color: rgba(0, 111, 187, 0.05);
    }

    .Polaris-TextField__SpinnerIcon {
      height: 12px;
      width: 12px;
    }

    .Polaris-Icon__Svg {
      fill: #637381;
    }
    
    .Polaris-TextField {
      position: relative;
    }
    
    .Polaris-TextField__Input {
      width: 100%;
      height: 36px;
      border: 1px solid #c9cccf;
      border-radius: 4px;
      padding: 0 26px 0 12px;
      font-size: 14px;
      color: #202223;
      outline: none;
      background: white;
    }
    
    .Polaris-TextField__Input:focus {
      border-color: #2c6ecb;
      box-shadow: 0 0 0 1px #2c6ecb;
      outline: none;
    }
    
    .Polaris-TextField__Backdrop {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      pointer-events: none;
      border-radius: 4px;
    }
    
    .Polaris-Connected {
      position: relative;
      display: flex;
    }
    
    .Polaris-Connected__Item {
      position: relative;
      flex: 1 1 auto;
    }

    .quantity-adjustment-fields {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }

    .quantity-field {
      flex: 1;
    }

    .quantity-field-label {
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
      font-size: 12px;
      color: #202223;
    }

    .quantity-input {
      width: 100%;
      padding: 8px;
      border: 1px solid #c9cccf;
      border-radius: 4px;
      font-size: 14px;
      color: #202223;
      outline: none;
      background: white;
    }

    .quantity-input:focus {
      border-color: #2c6ecb;
      box-shadow: 0 0 0 1px #2c6ecb;
      outline: none;
    }

    /* Column width adjustments */
    .Polaris-DataTable__Cell:first-child {
      width: 15%; /* SKU column */
    }
    
    .Polaris-DataTable__Cell:nth-child(2) {
      width: 30%; /* Item details column */
    }
    
    .Polaris-DataTable__Cell:nth-child(3),
    .Polaris-DataTable__Cell:nth-child(4),
    .Polaris-DataTable__Cell:nth-child(5),
    .Polaris-DataTable__Cell:nth-child(6) {
      width: 13.75%; /* Location columns - evenly distribute remaining 55% */
      padding: 8px !important;
    }
    
    /* Compact the inventory status */
    .inventory-status {
      padding: 4px 8px;
      min-width: 40px;
    }
    
    /* Make product details more compact */
    .product-detail-cell {
      gap: 8px;
    }

    /* Full-width SKU row styling - more robust approach */
    .sku-header-row {
      width: 100%;
      padding: 8px 0;
      background-color: #f4f6f8;
      position: relative;
      z-index: 1; /* Ensure it's above other content */
    }

    /* Use a different approach for the full-width effect */
    tr.Polaris-DataTable__Row:has(.sku-header-row) {
      background-color: #f4f6f8 !important;
    }

    .Polaris-DataTable__Row:has(.sku-header-row) .Polaris-DataTable__Cell {
      background-color: #f4f6f8 !important;
      border-bottom: 1px solid #dfe3e8 !important;
    }

    .Polaris-DataTable__Row:has(.sku-header-row) .Polaris-DataTable__Cell:not(:first-child) {
      padding: 0 !important;
      border-bottom: 1px solid #dfe3e8 !important;
    }

    /* Make sure the background color extends across the table */
    .shopify-like-table .Polaris-DataTable__Table {
      border-collapse: collapse;
    }

    /* Refresh button - moved here to avoid specificity issues */
    .shopify-refresh-btn {
      font-size: 14px;
      color: #202223;
      background-color: #f6f6f7;
      border: 1px solid #c9cccf;
      border-radius: 4px;
      padding: 6px 12px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }
    
    .shopify-refresh-btn:hover {
      background-color: #f1f2f3;
    }

    /* Product title link - show underline on hover */
    .product-title-link {
      color: #202223 !important; /* Force black color */
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s ease;
    }
    
    .product-title-link:hover {
      border-bottom: 1px solid #202223 !important;
      text-decoration: underline !important;
    }
    
    /* Variant ID styling - clickable but no underline */
    .variant-id {
      color: #637381; /* Subdued color */
      cursor: pointer;
      text-decoration: none !important;
      border-bottom: none !important;
      margin-left: 4px;
      display: inline-block;
      font-size: 12px;
    }

    .variant-id:hover {
      color: #202223;
    }

    /* Ensure product titles wrap properly */
    .product-detail-cell {
      gap: 8px;
      max-width: 100%;
      display: flex;
      flex-wrap: wrap;
    }
    
    .product-detail-cell > div {
      width: 100%;
      max-width: 300px;
      word-break: break-all !important;
      overflow-wrap: break-word !important;
      display: block;
      white-space: normal !important;
    }
    
    /* Add this to force text wrapping */
    .Polaris-Text--bodyMd {
      white-space: normal !important;
      word-break: break-all !important;
    }
  `;

  const simulateAnalysis = useCallback(() => {
    setIsAnalyzing(true);
    setVariantsScanned(0);
    setAnalysisResults([]);

    // Set total variants to 100 to match the displayed count
    setTotalVariants(100);

    // Mock data for the analysis results
    const mockResults: AnalysisResult[] = [
      { sku: 'ABC123', title: 'T-Shirt - Blue (Small)', stock: 15 },
      { sku: 'ABC123', title: 'T-Shirt - Blue (Medium)', stock: 8 },
      { sku: 'ABC125', title: 'T-Shirt - Blue (Large)', stock: 23 },
      { sku: 'ABC123', title: 'Denim Jeans (32x32)', stock: 5 },
      { sku: 'GHI789', title: 'Baseball Cap', stock: 42 },
      { sku: 'JKL012', title: 'Wool Sweater (Medium)', stock: 0 },
    ];

    let count = 0;
    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 5) + 1;
      if (count >= 100) {
        count = 100; // Set to exactly 100 variants
        clearInterval(interval);
        setTimeout(() => {
          setIsAnalyzing(false);
          setAnalysisResults(mockResults);
        }, 500);
      }
      setVariantsScanned(count);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = () => {
    simulateAnalysis();
  };

  const options = [
    { label: 'All SKUs', value: 'all' },
    { label: 'Active SKUs only', value: 'active' },
  ];

  // Update the duplicateSkuData array with more example products

  // Replace the existing duplicateSkuData array with this expanded version
  const duplicateSkuData = [
    {
      id: 1,
      sku: '24-6324-630024-630024-630024-630000',
      items: [
        {
          id: 1,
          title: 'AFH swan neck ring splint, stainless AFH swan neck ring splint, stainless steel AFH swan neck ring splint, stainless steel steel',
          productId: '6744234238973', // Add this
          variantId: '39424166953037',
          locations: {
            mumbai: 100,
            uniqueSpareWarehouse: 'NA'
          }
        },
        {
          id: 2,
          title: 'AFH swan neck ring splint, stainless steel',
          variantId: '39424166953037',
          locations: {
            mumbai: 100,
            uniqueSpareWarehouse: 'NA'
          }
        }
      ]
    },
    {
      id: 2,
      sku: 'ABC-123',
      items: [
        {
          id: 3,
          title: 'Product with inventory mismatch',
          variantId: '39424166953038',
          locations: {
            mumbai: 20,
            uniqueSpareWarehouse: 50
          }
        },
        {
          id: 4,
          title: 'Product with inventory mismatch',
          variantId: '39424166953038',
          locations: {
            mumbai: 25,
            uniqueSpareWarehouse: 45
          }
        }
      ]
    },
    {
      id: 3,
      sku: 'SHIRT-001',
      items: [
        {
          id: 5,
          title: 'Cotton T-Shirt - Navy Blue (Small)',
          variantId: '39424166953039',
          locations: {
            mumbai: 35,
            uniqueSpareWarehouse: 42
          }
        },
        {
          id: 6,
          title: 'Cotton T-Shirt - Navy Blue (Medium)',
          variantId: '39424166953040',
          locations: {
            mumbai: 28,
            uniqueSpareWarehouse: 37
          }
        },
        {
          id: 7,
          title: 'Cotton T-Shirt - Navy Blue (Large)',
          variantId: '39424166953041',
          locations: {
            mumbai: 15,
            uniqueSpareWarehouse: 24
          }
        }
      ]
    },
    {
      id: 4,
      sku: 'DENIM-2022',
      items: [
        {
          id: 8,
          title: 'Classic Denim Jeans (30x32)',
          variantId: '39424166953042',
          locations: {
            mumbai: 8,
            uniqueSpareWarehouse: 12
          }
        },
        {
          id: 9,
          title: 'Classic Denim Jeans (32x32)',
          variantId: '39424166953043',
          locations: {
            mumbai: 10,
            uniqueSpareWarehouse: 15
          }
        },
        {
          id: 10,
          title: 'Classic Denim Jeans (34x32)',
          variantId: '39424166953044',
          locations: {
            mumbai: 5,
            uniqueSpareWarehouse: 8
          }
        }
      ]
    },
    {
      id: 5,
      sku: 'HOODIE-XYZ',
      items: [
        {
          id: 11,
          title: 'Winter Hoodie - Gray (Small)',
          variantId: '39424166953045',
          locations: {
            mumbai: 42,
            uniqueSpareWarehouse: 30
          }
        },
        {
          id: 12,
          title: 'Winter Hoodie - Gray (Medium)',
          variantId: '39424166953046',
          locations: {
            mumbai: 38,
            uniqueSpareWarehouse: 25
          }
        }
      ]
    },
    {
      id: 6,
      sku: 'SHOES-2023',
      items: [
        {
          id: 13,
          title: 'Running Shoes - Black (Size 8)',
          variantId: '39424166953047',
          locations: {
            mumbai: 12,
            uniqueSpareWarehouse: 18
          }
        },
        {
          id: 14,
          title: 'Running Shoes - Black (Size 9)',
          variantId: '39424166953048',
          locations: {
            mumbai: 14,
            uniqueSpareWarehouse: 16
          }
        },
        {
          id: 15,
          title: 'Running Shoes - Black (Size 10)',
          variantId: '39424166953049',
          locations: {
            mumbai: 10,
            uniqueSpareWarehouse: 15
          }
        }
      ]
    }
  ];

  // Handle filter change in the dropdown
  const handleFilterChange = useCallback((value: string) => {
    setDuplicateFilterType(value);
    setSearchSku('');
    
    if (value === 'all') {
      setFilteredSkus(duplicateSkuData);
    } else if (value === 'mismatch') {
      // Filter to only show SKUs with inventory mismatches between locations
      const mismatchSkus = duplicateSkuData.filter(skuGroup => {
        // Check if any items in the group have different inventory values across locations
        return skuGroup.items.some((item, idx) => {
          if (idx === 0) return false; // Skip first item (need at least one to compare)
          const firstItem = skuGroup.items[0];
          return (
            item.locations.mumbai !== firstItem.locations.mumbai || 
            item.locations.uniqueSpareWarehouse !== firstItem.locations.uniqueSpareWarehouse
          );
        });
      });
      setFilteredSkus(mismatchSkus);
    }
  }, [duplicateSkuData]);

  // Handle SKU search
  const handleSearch = useCallback(() => {
    setIsSearching(true);
    
    if (searchSku.trim() === '') {
      handleFilterChange(duplicateFilterType);
    } else {
      const results = duplicateSkuData.filter(skuGroup => 
        skuGroup.sku.toLowerCase().includes(searchSku.toLowerCase())
      );
      setFilteredSkus(results);
    }
    
    setIsSearching(false);
  }, [searchSku, duplicateFilterType, handleFilterChange, duplicateSkuData]);

  // Initialize filtered SKUs on component mount
  useEffect(() => {
    setFilteredSkus(duplicateSkuData);
  }, []);

  // Handle inventory field changes
  const handleInventoryChange = useCallback((skuId: number, location: string, value: string) => {
    setInventoryUpdates(prev => ({
      ...prev,
      [skuId]: {
        ...(prev[skuId] || {}),
        [location]: value
      }
    }));
  }, []);
  
  // Handle update button click
  const handleUpdateInventory = useCallback((skuGroup: any) => {
    const updates = inventoryUpdates[skuGroup.id];
    if (!updates) return;
    
    // Update the filtered SKUs with new inventory values
    const updatedSkus = filteredSkus.map(group => {
      if (group.id !== skuGroup.id) return group;
      
      // Create a deep copy of the group to modify
      const updatedGroup = {...group};
      
      // Update locations in all items
      updatedGroup.items = group.items.map((item: any) => {
        const updatedItem = {...item};
        updatedItem.locations = {...item.locations};
        
        // Apply updates for each location
        if (updates.mumbai && updates.mumbai.trim() !== '') {
          updatedItem.locations.mumbai = parseInt(updates.mumbai, 10) || 0;
        }
        
        if (updates.uniqueSpareWarehouse && updates.uniqueSpareWarehouse.trim() !== '') {
          updatedItem.locations.uniqueSpareWarehouse = updates.uniqueSpareWarehouse === 'NA' ? 
            'NA' : (parseInt(updates.uniqueSpareWarehouse, 10) || 0);
        }
        
        return updatedItem;
      });
      
      return updatedGroup;
    });
    
    // Update state and clear the input fields for this SKU
    setFilteredSkus(updatedSkus);
    setInventoryUpdates(prev => {
      const newUpdates = {...prev};
      delete newUpdates[skuGroup.id];
      return newUpdates;
    });
    
    setToastMessage(`Updated inventory for SKU: ${skuGroup.sku}`);
    setToastActive(true);
  }, [filteredSkus, inventoryUpdates]);

  // Add function to export filtered SKUs to CSV
  const exportToCSV = useCallback(() => {
    if (filteredSkus.length === 0) {
      setToastMessage('No data to export');
      setToastActive(true);
      return;
    }

    // Create CSV header row with updated column names
    let csvContent = 'SKU,Item Title,Variant ID,Location 1,Location 2\n';

    // Add data rows
    filteredSkus.forEach((skuGroup: SkuGroup) => {
      skuGroup.items.forEach((item: SkuItem) => {
        const row = [
          `"${skuGroup.sku}"`,
          `"${item.title}"`,
          `"${item.variantId}"`,
          `"${item.locations.mumbai}"`,
          `"${item.locations.uniqueSpareWarehouse}"`
        ].join(',');
        csvContent += row + '\n';
      });
    });

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set file name with current date
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `duplicate-skus-${date}.csv`);
    link.style.visibility = 'hidden';
    
    // Append to the document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setToastMessage('Export complete');
    setToastActive(true);
  }, [filteredSkus]);

  // Replace the existing handleRefreshChart function with this one
  const handleRefreshChart = useCallback((skuId: number) => {
    // Find the SKU group by ID to get the SKU name
    const skuGroup = filteredSkus.find(group => group.id === skuId);
    const skuName = skuGroup ? skuGroup.sku : `#${skuId}`;
    
    setToastMessage(`Refreshing data for SKU ${skuName}...`);
    setToastActive(true);
    
    // Here you would typically fetch fresh data
    // For now, just show a toast notification
    setTimeout(() => {
      setToastMessage(`Data refreshed for SKU ${skuName}`);
      setToastActive(true);
    }, 1000);
  }, [filteredSkus]);

  // Add these custom styles to match Shopify's admin UI

  // Custom styles for Shopify-like tables
  

  const [editingCell, setEditingCell] = useState<{skuId: number, itemId: number, location: string} | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Add this useEffect to focus the input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  // Add these handler functions
  const startEditing = (skuId: number, itemId: number, location: string, value: number | string) => {
    setEditingCell({ skuId, itemId, location });
    setEditValue(String(value));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleEditBlur = () => {
    if (editingCell) {
      saveEdit();
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const saveEdit = () => {
    if (editingCell && editValue.trim() !== '') {
      // Find the SKU group and item
      const updatedSkus = filteredSkus.map(group => {
        if (group.id !== editingCell.skuId) return group;
        
        const updatedGroup = {...group};
        updatedGroup.items = group.items.map((item: SkuItem) => {
          if (item.id !== editingCell.itemId) return item;
          
          const updatedItem = {...item};
          updatedItem.locations = {...item.locations};
          
          // Update the specific location
          if (editingCell.location === 'mumbai') {
            updatedItem.locations.mumbai = isNaN(parseInt(editValue)) ? 0 : parseInt(editValue);
          } else if (editingCell.location === 'uniqueSpareWarehouse') {
            updatedItem.locations.uniqueSpareWarehouse = isNaN(parseInt(editValue)) ? 0 : parseInt(editValue);
          }
          
          return updatedItem;
        });
        
        return updatedGroup;
      });
      
      setFilteredSkus(updatedSkus);
      setToastMessage(`Updated quantity to ${editValue}`);
      setToastActive(true);
    }
    
    setEditingCell(null);
  };

  // Update the EditableQuantity component to handle all 4 locations
  const EditableQuantity = ({ value, onUpdate, skuGroup, item, locationKey }: { 
    value: number | string, 
    onUpdate: (newValue: number | string) => void,
    skuGroup: SkuGroup,
    item: SkuItem,
    locationKey: string
  }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [newValue, setNewValue] = useState<string>(String(value));
    const popupRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      // Close popup when clicking outside
      const handleClickOutside = (event: MouseEvent) => {
        if (
          popupRef.current && 
          !popupRef.current.contains(event.target as Node) &&
          wrapperRef.current && 
          !wrapperRef.current.contains(event.target as Node)
        ) {
          setIsPopupOpen(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    // Check if the popup will be off-screen and adjust its position
    const getPopupPosition = () => {
      if (!wrapperRef.current) return {};
      
      // Get the wrapper's position
      const rect = wrapperRef.current.getBoundingClientRect();
      const isNearRightEdge = window.innerWidth - rect.right < 230; // 230px is approx popup width
      
      if (isNearRightEdge) {
        return { right: '0', left: 'auto' };
      }
      
      return { left: '0', right: 'auto' };
    };

    const handleOpen = () => {
      setNewValue(String(value));
      setIsPopupOpen(true);
    };
    
    const handleSave = () => {
      const numValue = parseInt(newValue, 10);
      if (!isNaN(numValue)) {
        // Update all items in the same SKU group with the new quantity for this location
        const updatedSkus = filteredSkus.map(group => {
          if (group.id !== skuGroup.id) return group;
          
          const updatedItems = group.items.map((i: SkuItem) => {
            // Create a deep copy of the item
            const updatedItem = {...i};
            
            // Create a deep copy of locations or initialize if it doesn't exist
            const updatedLocations = {...i.locations} as any;
            
            // Update the specified location for ALL items
            if (locationKey === 'location3') {
              // For location3, directly update or initialize it
              updatedLocations.location3 = numValue;
            } else if (locationKey === 'location4') {
              // For location4, directly update or initialize it
              updatedLocations.location4 = numValue;
            } else {
              // For standard locations like mumbai and uniqueSpareWarehouse
              updatedLocations[locationKey] = numValue;
            }
            
            return {
              ...updatedItem,
              locations: updatedLocations
            };
          });
          
          return {
            ...group,
            items: updatedItems
          };
        });
        
        setFilteredSkus(updatedSkus);
        
        // Get a readable name for the location to display in the toast
        const locationNames = {
          "mumbai": "Location 1",
          "uniqueSpareWarehouse": "Location 2",
          "location3": "Location 3",
          "location4": "Location 4"
        };
        
        setToastMessage(`Updated quantity to ${numValue} for all products with SKU: ${skuGroup.sku} at ${locationNames[locationKey as keyof typeof locationNames]}`);
        setToastActive(true);
      }
      setIsPopupOpen(false);
    };
    
    const handleCancel = () => {
      setIsPopupOpen(false);
    };

    // Handle new value input change
    const handleNewValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewValue(e.target.value);
    };

    // Determine if the value should be shown as in-stock or low-stock
    const isInStock = value === 'NA' || Number(value) >= 10;
    
    return (
      <div className="stock-value-wrapper" ref={wrapperRef} onClick={handleOpen}>
        <div className={`inventory-status ${isInStock ? 'in-stock' : 'low-stock'}`}>
          {value}
        </div>
        
        {isPopupOpen && (
          <div 
            className="quantity-popup" 
            ref={popupRef} 
            onClick={(e) => e.stopPropagation()}
            style={{
              ...getPopupPosition(),
              zIndex: 999 // Ensure popup is on top of everything
            }}
          >
            <div className="quantity-field" style={{ width: "100%" }}>
              <label htmlFor={`newValue-${item.id}-${locationKey}`} className="quantity-field-label">Enter quantity</label>
              <input
                id={`newValue-${item.id}-${locationKey}`}
                type="number"
                className="quantity-input"
                value={newValue}
                onChange={handleNewValueChange}
                style={{ width: "100%" }}
              />
            </div>
            
            <div className="quantity-popup-buttons" style={{ marginTop: "16px" }}>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button variant="primary" onClick={handleSave}>Save</Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Update the way you render the SKU header row

  // First, add this to your component before the return statement:
  const renderCustomRow = (row: any[], index: number) => {
    // Check if this is a SKU header row (first cell has sku-header-row class)
    if (
      row[0] &&
      React.isValidElement(row[0]) &&
      typeof row[0].props === 'object' &&
      row[0].props !== null &&
      'className' in row[0].props &&
      (row[0].props as { className?: string }).className === 'sku-header-row'
    ) {
      return (
        <tr key={`row-${index}`} className="Polaris-DataTable__Row">
          <th 
            colSpan={6} // Set this to match your total number of columns
            className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn" 
            scope="row"
          >
            {row[0]}
          </th>
        </tr>
      );
    }
    
    // Regular row rendering
    return (
      <tr key={`row-${index}`} className="Polaris-DataTable__Row">
        {row.map((cell, cellIndex) => {
          const isFirstColumn = cellIndex === 0;
          return (
            <td 
              key={`cell-${index}-${cellIndex}`}
              className={`Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop ${
                isFirstColumn ? 'Polaris-DataTable__Cell--firstColumn' : ''
              }`}
            >
              {cell}
            </td>
          );
        })}
      </tr>
    );
  };

  const getShopifyProductUrl = (productId: string) => {
    // You'll need to replace 'your-store-name' with your actual Shopify store name or a variable
    return `https://admin.shopify.com/store/your-store-name/products/${productId}`;
  };

  const getShopifyVariantUrl = (productId: string, variantId: string) => {
    // This links directly to the variant tab in Shopify admin
    return `https://admin.shopify.com/store/your-store-name/products/${productId}/variants/${variantId}`;
  };

  return (
    <Page
      fullWidth
      title="Detailed View"
      backAction={{
        content: 'Back to Inventory',
        onAction: () => navigate('/flo/inventory')
      }}
    >
      {/* Info Box */}
      <Layout>
        <Layout.Section>
          <Card>
            <Box padding="400">
              <TextContainer spacing="tight">
                <Text as="p" variant="bodyMd">
                  Analyze all products. Detect duplicate SKUs. Verify and correct stock mismatch.
                </Text>
                <Link 
                  url="https://your-company-docs.com/duplicate-sku-analysis" 
                  external 
                  removeUnderline
                >
                  Learn more
                </Link>
              </TextContainer>
            </Box>
          </Card>
        </Layout.Section>

        {/* Analyzer */}
        <Layout.Section>
          <Card>
            <Box padding="400">
              <Text as="h3" variant="headingSm">
                1. Analyze Products
              </Text>

              <Box paddingBlockStart="400">
                <InlineGrid columns={{ xs: '1fr', sm: '2fr 1fr' }} gap="400" alignItems="end">
                  <Select
                    label="Select SKU Opation"
                    options={options}
                    onChange={setSelectedSkuOption}
                    value={selectedSkuOption}
                    disabled={isAnalyzing}
                  />
                  
                  <Button
                    onClick={handleAnalyze}
                    variant="primary"
                    disabled={isAnalyzing}
                    fullWidth
                  >
                    Analyze Now
                  </Button>
                </InlineGrid>
              </Box>

              {isAnalyzing && (
                <Box paddingBlockStart="400">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      paddingBlockEnd: "var(--p-space-300)"
                    }}
                  >
                    <Box paddingInlineEnd="200">
                      <Spinner size="small" />
                    </Box>
                    <Text variant="bodySm" as="p">
                      <b>{variantsScanned}</b> Variants scanned
                    </Text>
                  </div>
                  <ProgressBar
                    progress={Math.floor((variantsScanned / totalVariants) * 100)}
                    size="small"
                  />
                </Box>
              )}
            </Box>
          </Card>
        </Layout.Section>

        {/* Analysis Results */}
        {analysisResults.length > 0 && (
          <Layout.Section>
            <Card>
              <Box padding="400" paddingBlockEnd="500">
                <Text as="h3" variant="headingSm" fontWeight="bold">
                  2. View Duplicates and Update Inventory
                </Text>
                
                <Box paddingBlockStart="400">
                  <InlineGrid columns={{ xs: 1, md: '1fr 1fr auto auto' }} gap="400" alignItems="start">
                    <Select
                      label="Filter"
                      labelHidden
                      options={[
                        { label: 'Show all duplicate SKUs', value: 'all' },
                        { label: 'Show duplicate SKUs with mismatch inventory', value: 'mismatch' }
                      ]}
                      value={duplicateFilterType}
                      onChange={handleFilterChange}
                    />
                    
                    <TextField
                      label="Search SKU"
                      labelHidden
                      placeholder="Provide SKU"
                      autoComplete="off"
                      value={searchSku}
                      onChange={setSearchSku}
                    />
                    
                    <Button onClick={handleSearch} disabled={isSearching}>
                      {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                    
                    <div style={{ marginLeft: 'auto' }}>
                      <Button variant="secondary" onClick={exportToCSV}>Export</Button>
                    </div>
                  </InlineGrid>
                </Box>
                
                <Box paddingBlockStart="500">
                  {filteredSkus.length > 0 ? (
                    <>
                      <style>{shopifyTableStyles}</style>
                      <div className="shopify-like-table">
                        <div className="shopify-like-table">
                          <table className="Polaris-DataTable__Table">
                            <thead>
                              <tr>
                                <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn">
                                  <Text as="span" variant="bodySm" fontWeight="semibold">SKU</Text>
                                </th>
                                <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop">
                                  <Text as="span" variant="bodySm" fontWeight="semibold">Items</Text>
                                </th>
                                <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" style={{ textAlign: "center" }}>
                                  <Text as="span" variant="bodySm" fontWeight="semibold">Location 1</Text>
                                </th>
                                <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" style={{ textAlign: "center" }}>
                                  <Text as="span" variant="bodySm" fontWeight="semibold">Location 2</Text>
                                </th>
                                <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" style={{ textAlign: "center" }}>
                                  <Text as="span" variant="bodySm" fontWeight="semibold">Location 3</Text>
                                </th>
                                <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" style={{ textAlign: "center" }}>
                                  <Text as="span" variant="bodySm" fontWeight="semibold">Location 4</Text>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredSkus.map((skuGroup, groupIndex) => (
                                <React.Fragment key={skuGroup.id}>
                                  {/* SKU header row */}
                                  <tr className="Polaris-DataTable__Row">
                                    <th
                                      colSpan={6}
                                      className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn"
                                      scope="row"
                                    >
                                      <div className="sku-header-row">
                                        <Text as="span" variant="bodyMd" fontWeight="semibold">
                                          {skuGroup.sku}
                                        </Text>
                                      </div>
                                    </th>
                                  </tr>
                                  {/* Item rows */}
                                  {skuGroup.items.map((item: SkuItem) => (
                                    <tr className="Polaris-DataTable__Row" key={item.id}>
                                      <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn"></td>
                                      <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop">
                                        <div className="product-detail-cell">
                                          <div style={{ 
                                            width: "100%", 
                                            maxWidth: "300px"
                                          }}>
                                            <div style={{ 
                                              marginBottom: "4px", 
                                              whiteSpace: "nowrap", 
                                              overflow: "hidden", 
                                              textOverflow: "ellipsis",
                                              width: "100%"
                                            }}>
                                              <Link 
                                                url={getShopifyProductUrl(item.productId || '')} 
                                                external
                                                monochrome
                                                removeUnderline
                                              >
                                                <span
                                                  style={{
                                                    display: "block",
                                                    color: "#202223",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    maxWidth: "100%"
                                                  }}
                                                >
                                                  <Text as="span" variant="bodyMd" fontWeight="medium">
                                                    {item.title}
                                                  </Text>
                                                </span>
                                              </Link>
                                            </div>
                                            <div>
                                              <Text as="span" variant="bodySm" tone="subdued">
                                                Variant ID:&nbsp;
                                                <Link 
                                                  url={getShopifyVariantUrl(item.productId || '', item.variantId)} 
                                                  external 
                                                  removeUnderline
                                                >
                                                  <span className="variant-id">{item.variantId}</span>
                                                </Link>
                                              </Text>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" style={{ textAlign: "center", padding: "4px" }}>
                                        <EditableQuantity
                                          value={item.locations.mumbai}
                                          skuGroup={skuGroup}
                                          item={item}
                                          locationKey="mumbai"
                                          onUpdate={(newValue) => {
                                            // This onUpdate is no longer needed as the logic is inside the component
                                            // but we'll keep it for backward compatibility
                                          }}
                                        />
                                      </td>
                                      <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" style={{ textAlign: "center", padding: "4px" }}>
                                        <EditableQuantity
                                          value={item.locations.uniqueSpareWarehouse}
                                          skuGroup={skuGroup}
                                          item={item}
                                          locationKey="uniqueSpareWarehouse"
                                          onUpdate={(newValue) => {
                                            // This onUpdate is no longer needed as the logic is inside the component
                                          }}
                                        />
                                      </td>
                                      <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" style={{ textAlign: "center" }}>
                                        <EditableQuantity
                                          value={(item.locations as any).location3 || Math.floor((item.id * 13) % 20) + 1}
                                          skuGroup={skuGroup}
                                          item={item}
                                          locationKey="location3"
                                          onUpdate={() => {}}
                                        />
                                      </td>
                                      <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" style={{ textAlign: "center" }}>
                                        <EditableQuantity
                                          value={(item.locations as any).location4 || Math.floor((item.id * 17) % 20) + 1}
                                          skuGroup={skuGroup}
                                          item={item}
                                          locationKey="location4"
                                          onUpdate={() => {}}
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                  {/* Divider row between SKU groups */}
                                  {groupIndex < filteredSkus.length - 1 && (
                                    <tr>
                                      <td 
                                        colSpan={6} 
                                        style={{ 
                                          height: "1px", 
                                          backgroundColor: "#babfc3", // Make all dividers darker
                                          padding: 0 
                                        }}
                                      ></td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Box padding="400" as="div">
                      <div style={{ textAlign: "center" }}>
                        <Text as="p" tone="subdued">No duplicate SKUs found matching your criteria</Text>
                      </div>
                    </Box>
                  )}
                </Box>
              </Box>
            </Card>
          </Layout.Section>
        )}
        
        {/* Bottom spacing to match Shopify admin UI */}
        <Layout.Section>
          <Box paddingBlockEnd="600">
            {/* This provides the standard 24px bottom spacing using Polaris tokens */}
          </Box>
        </Layout.Section>
      </Layout>

      {toastActive && (
        <Toast content={toastMessage} onDismiss={() => setToastActive(false)} />
      )}
    </Page>
  );
}