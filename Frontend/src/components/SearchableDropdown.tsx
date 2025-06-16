"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search, X } from "lucide-react"

interface Option {
  value: string
  label: string
  sublabel?: string
}

interface SearchableDropdownProps {
  options: Option[]
  value: Option | null
  onChange: (option: Option | null) => void
  placeholder?: string
  searchPlaceholder?: string
  allowClear?: boolean
  disabled?: boolean
  className?: string
  allowCustomValue?: boolean // New prop
  customValueLabel?: string // New prop
}

export default function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  allowClear = true,
  disabled = false,
  className = "",
  allowCustomValue = false,
  customValueLabel = "Create new:",
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Filter options based on search term
  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (option.sublabel && option.sublabel.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Add custom value option if allowed and search term doesn't match any existing option
  const showCustomValue =
    allowCustomValue &&
    searchTerm.trim() &&
    !filteredOptions.some(
      (option) =>
        option.label.toLowerCase() === searchTerm.toLowerCase() ||
        option.value.toLowerCase() === searchTerm.toLowerCase(),
    )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      setSearchTerm("")
    }
  }

  const handleSelect = (option: Option) => {
    onChange(option)
    setIsOpen(false)
    setSearchTerm("")
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className="relative w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="block truncate">
          {value ? (
            <div>
              <div className="font-medium">{value.label}</div>
              {value.sublabel && <div className="text-sm text-gray-500">{value.sublabel}</div>}
            </div>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          {value && allowClear && !disabled ? (
            <button onClick={handleClear} className="p-1 hover:bg-gray-100 rounded-full mr-1" title="Clear selection">
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          ) : null}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-80 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-hidden focus:outline-none">
          {/* Search input */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-60 overflow-auto">
            {showCustomValue && (
              <button
                onClick={() => handleSelect({ value: searchTerm.trim(), label: searchTerm.trim() })}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100"
              >
                <div>
                  <div className="font-medium text-blue-600">
                    {customValueLabel} "{searchTerm.trim()}"
                  </div>
                  <div className="text-xs text-gray-500">Create new item</div>
                </div>
              </button>
            )}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    {option.sublabel && <div className="text-gray-500">{option.sublabel}</div>}
                  </div>
                </button>
              ))
            ) : !showCustomValue ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">No results found</div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}