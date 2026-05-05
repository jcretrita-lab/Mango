import { OrgUnit, Position, Rank, SalaryGrade, OrgUnitType } from "../types";

export const MOCK_UNIT_TYPES: OrgUnitType[] = [
  {
    "id": "ut0",
    "name": "Company",
    "level": 1
  },
  {
    "id": "ut1",
    "name": "Division",
    "level": 2
  },
  {
    "id": "ut2",
    "name": "Department",
    "level": 3
  },
  {
    "id": "ut3",
    "name": "Section",
    "level": 4
  }
];

export const MOCK_GRADES: SalaryGrade[] = [
  {
    "id": "sg-1",
    "code": "SG-1",
    "name": "Utility / Support I",
    "amount": 16000,
    "minSalary": 15000,
    "maxSalary": 17000
  },
  {
    "id": "sg-2",
    "code": "SG-2",
    "name": "Utility / Support II",
    "amount": 18500,
    "minSalary": 17000,
    "maxSalary": 20000
  },
  {
    "id": "sg-3",
    "code": "SG-3",
    "name": "Clerical / Staff I",
    "amount": 22000,
    "minSalary": 20000,
    "maxSalary": 24000
  },
  {
    "id": "sg-4",
    "code": "SG-4",
    "name": "Clerical / Staff II",
    "amount": 26000,
    "minSalary": 24000,
    "maxSalary": 28000
  },
  {
    "id": "sg-5",
    "code": "SG-5",
    "name": "Professional I",
    "amount": 32000,
    "minSalary": 28000,
    "maxSalary": 36000
  },
  {
    "id": "sg-6",
    "code": "SG-6",
    "name": "Professional II",
    "amount": 40000,
    "minSalary": 36000,
    "maxSalary": 45000
  },
  {
    "id": "sg-7",
    "code": "SG-7",
    "name": "Specialist I",
    "amount": 50000,
    "minSalary": 45000,
    "maxSalary": 58000
  },
  {
    "id": "sg-8",
    "code": "SG-8",
    "name": "Specialist II",
    "amount": 65000,
    "minSalary": 58000,
    "maxSalary": 72000
  },
  {
    "id": "sg-9",
    "code": "SG-9",
    "name": "Senior Specialist I",
    "amount": 80000,
    "minSalary": 72000,
    "maxSalary": 90000
  },
  {
    "id": "sg-10",
    "code": "SG-10",
    "name": "Senior Specialist II",
    "amount": 100000,
    "minSalary": 90000,
    "maxSalary": 115000
  },
  {
    "id": "sg-11",
    "code": "SG-11",
    "name": "Principal / Manager I",
    "amount": 130000,
    "minSalary": 115000,
    "maxSalary": 145000
  },
  {
    "id": "sg-12",
    "code": "SG-12",
    "name": "Principal / Manager II",
    "amount": 165000,
    "minSalary": 145000,
    "maxSalary": 185000
  },
  {
    "id": "sg-13",
    "code": "SG-13",
    "name": "Director I",
    "amount": 210000,
    "minSalary": 185000,
    "maxSalary": 240000
  },
  {
    "id": "sg-14",
    "code": "SG-14",
    "name": "Director II",
    "amount": 280000,
    "minSalary": 240000,
    "maxSalary": 320000
  },
  {
    "id": "sg-15",
    "code": "SG-15",
    "name": "Vice President I",
    "amount": 380000,
    "minSalary": 320000,
    "maxSalary": 440000
  },
  {
    "id": "sg-16",
    "code": "SG-16",
    "name": "Vice President II",
    "amount": 500000,
    "minSalary": 440000,
    "maxSalary": 600000
  },
  {
    "id": "sg-17",
    "code": "SG-17",
    "name": "Executive VP",
    "amount": 700000,
    "minSalary": 600000,
    "maxSalary": 850000
  },
  {
    "id": "sg-18",
    "code": "SG-18",
    "name": "C-Suite / Chief",
    "amount": 1000000,
    "minSalary": 850000,
    "maxSalary": 1500000
  }
];

export const MOCK_ORG_UNITS: OrgUnit[] = [
  {
    "id": "root-corporate",
    "name": "Diwa Learning Systems Inc.",
    "type": "Company",
    "children": [
      {
        "id": "ou-corp-0",
        "name": "Sales Support",
        "type": "Division",
        "parentId": "root-corporate",
        "children": [
          {
            "id": "ou-corp-1",
            "name": "Sales",
            "type": "Department",
            "parentId": "ou-corp-0",
            "children": [
              {
                "id": "ou-corp-2",
                "name": "DDN South Luzon A",
                "type": "Section",
                "parentId": "ou-corp-1",
                "children": [],
                "headPositionId": "p-corp-0"
              }
            ],
            "headPositionId": "p-corp-0"
          }
        ],
        "headPositionId": "p-corp-0"
      },
      {
        "id": "ou-corp-3",
        "name": "Sales",
        "type": "Division",
        "parentId": "root-corporate",
        "children": [
          {
            "id": "ou-corp-4",
            "name": "Sales",
            "type": "Department",
            "parentId": "ou-corp-3",
            "children": [
              {
                "id": "ou-corp-5",
                "name": "Sales",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-1"
              },
              {
                "id": "ou-corp-6",
                "name": "DLSI - NCR South",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-4"
              },
              {
                "id": "ou-corp-7",
                "name": "DLSI - NCR North",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-7"
              },
              {
                "id": "ou-corp-8",
                "name": "DLSI - NCR Central",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-11"
              },
              {
                "id": "ou-corp-9",
                "name": "DLSI - Laguna",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-17"
              },
              {
                "id": "ou-corp-10",
                "name": "DLSI",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-18"
              },
              {
                "id": "ou-corp-11",
                "name": "DDN Upper North Luzon",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-21"
              },
              {
                "id": "ou-corp-12",
                "name": "DDN South Luzon B",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-22"
              },
              {
                "id": "ou-corp-13",
                "name": "DDN South Luzon A",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-26"
              },
              {
                "id": "ou-corp-14",
                "name": "DDN North Luzon",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-31"
              },
              {
                "id": "ou-corp-15",
                "name": "DDN Lower North Luzon",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-34"
              },
              {
                "id": "ou-corp-16",
                "name": "DDN Laguna",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-39"
              },
              {
                "id": "ou-corp-17",
                "name": "DDN Davao - Zamboanga",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-40"
              },
              {
                "id": "ou-corp-18",
                "name": "DDN Davao - Socsargen",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-41"
              },
              {
                "id": "ou-corp-19",
                "name": "DDN Davao - Cotabato",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-42"
              },
              {
                "id": "ou-corp-20",
                "name": "DDN Davao - CDO / Zamboanga",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-43"
              },
              {
                "id": "ou-corp-21",
                "name": "DDN Davao - CDO",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-44"
              },
              {
                "id": "ou-corp-22",
                "name": "DDN Davao",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-45"
              },
              {
                "id": "ou-corp-23",
                "name": "DDN Cotabato",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-49"
              },
              {
                "id": "ou-corp-24",
                "name": "DDN Cebu - Tacloban",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-50"
              },
              {
                "id": "ou-corp-25",
                "name": "DDN Cebu - Iloilo",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-55"
              },
              {
                "id": "ou-corp-26",
                "name": "DDN Cebu",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-59"
              },
              {
                "id": "ou-corp-27",
                "name": "DDN Cagayan De Oro",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-61"
              },
              {
                "id": "ou-corp-28",
                "name": "DDN Bulacan",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-62"
              },
              {
                "id": "ou-corp-29",
                "name": "DDI - NCR South",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-68"
              },
              {
                "id": "ou-corp-30",
                "name": "DDI - NCR North",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-69"
              },
              {
                "id": "ou-corp-31",
                "name": "DDI - NCR Central",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-71"
              },
              {
                "id": "ou-corp-32",
                "name": "Checkbox",
                "type": "Section",
                "parentId": "ou-corp-4",
                "children": [],
                "headPositionId": "p-corp-72"
              }
            ],
            "headPositionId": "p-corp-31"
          }
        ],
        "headPositionId": "p-corp-31"
      },
      {
        "id": "ou-corp-33",
        "name": "PMCCG",
        "type": "Division",
        "parentId": "root-corporate",
        "children": [
          {
            "id": "ou-corp-34",
            "name": "Corporate Communication",
            "type": "Department",
            "parentId": "ou-corp-33",
            "children": [
              {
                "id": "ou-corp-35",
                "name": "DLSI",
                "type": "Section",
                "parentId": "ou-corp-34",
                "children": [],
                "headPositionId": "p-corp-78"
              }
            ],
            "headPositionId": "p-corp-78"
          },
          {
            "id": "ou-corp-36",
            "name": "Product Development and Innovation",
            "type": "Department",
            "parentId": "ou-corp-33",
            "children": [],
            "headPositionId": "p-corp-79"
          },
          {
            "id": "ou-corp-37",
            "name": "Product Management Group",
            "type": "Department",
            "parentId": "ou-corp-33",
            "children": [
              {
                "id": "ou-corp-38",
                "name": "Print",
                "type": "Section",
                "parentId": "ou-corp-37",
                "children": [],
                "headPositionId": "p-corp-82"
              },
              {
                "id": "ou-corp-39",
                "name": "Digital",
                "type": "Section",
                "parentId": "ou-corp-37",
                "children": [],
                "headPositionId": "p-corp-84"
              }
            ],
            "headPositionId": "p-corp-82"
          }
        ],
        "headPositionId": "p-corp-78"
      },
      {
        "id": "ou-corp-40",
        "name": "Officers",
        "type": "Division",
        "parentId": "root-corporate",
        "children": [
          {
            "id": "ou-corp-41",
            "name": "Office of the President",
            "type": "Department",
            "parentId": "ou-corp-40",
            "children": [],
            "headPositionId": "p-corp-86"
          }
        ],
        "headPositionId": "p-corp-86"
      },
      {
        "id": "ou-corp-42",
        "name": "Marketing",
        "type": "Division",
        "parentId": "root-corporate",
        "children": [
          {
            "id": "ou-corp-43",
            "name": "Telesales",
            "type": "Department",
            "parentId": "ou-corp-42",
            "children": [
              {
                "id": "ou-corp-44",
                "name": "DLSI",
                "type": "Section",
                "parentId": "ou-corp-43",
                "children": [],
                "headPositionId": "p-corp-90"
              }
            ],
            "headPositionId": "p-corp-90"
          },
          {
            "id": "ou-corp-45",
            "name": "Marketing Services",
            "type": "Department",
            "parentId": "ou-corp-42",
            "children": [
              {
                "id": "ou-corp-46",
                "name": "DLSI",
                "type": "Section",
                "parentId": "ou-corp-45",
                "children": [],
                "headPositionId": "p-corp-91"
              }
            ],
            "headPositionId": "p-corp-91"
          },
          {
            "id": "ou-corp-47",
            "name": "Product Management Group",
            "type": "Department",
            "parentId": "ou-corp-42",
            "children": [
              {
                "id": "ou-corp-48",
                "name": "Print",
                "type": "Section",
                "parentId": "ou-corp-47",
                "children": [],
                "headPositionId": "p-corp-94"
              }
            ],
            "headPositionId": "p-corp-94"
          }
        ],
        "headPositionId": "p-corp-91"
      },
      {
        "id": "ou-corp-49",
        "name": "Genyo",
        "type": "Division",
        "parentId": "root-corporate",
        "children": [
          {
            "id": "ou-corp-50",
            "name": "e-Learning Training Dept.",
            "type": "Department",
            "parentId": "ou-corp-49",
            "children": [
              {
                "id": "ou-corp-51",
                "name": "Visayas - Deopante Group",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-95"
              },
              {
                "id": "ou-corp-52",
                "name": "South Luzon - Rizaldo Group",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-98"
              },
              {
                "id": "ou-corp-53",
                "name": "South Luzon - Dela Cueva Group",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-102"
              },
              {
                "id": "ou-corp-54",
                "name": "Oliver Candido Group",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-105"
              },
              {
                "id": "ou-corp-55",
                "name": "Office Based",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-106"
              },
              {
                "id": "ou-corp-56",
                "name": "North Luzon - Valencia Group",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-107"
              },
              {
                "id": "ou-corp-57",
                "name": "North Luzon - Sampang Group",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-114"
              },
              {
                "id": "ou-corp-58",
                "name": "NCR - Laycano Group",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-115"
              },
              {
                "id": "ou-corp-59",
                "name": "NCR - Candido Group",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-116"
              },
              {
                "id": "ou-corp-60",
                "name": "NCR - Berras Group",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-118"
              },
              {
                "id": "ou-corp-61",
                "name": "Mindanao - Murchante Group",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-124"
              },
              {
                "id": "ou-corp-62",
                "name": "Lyka Lubuguin Group",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-126"
              },
              {
                "id": "ou-corp-63",
                "name": "Leigh Barruga Group",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-130"
              },
              {
                "id": "ou-corp-64",
                "name": "Lance Miranda Group",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-133"
              },
              {
                "id": "ou-corp-65",
                "name": "Jerome Dela Cueva Group",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-134"
              },
              {
                "id": "ou-corp-66",
                "name": "Jeffrey Valencia Group",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-137"
              },
              {
                "id": "ou-corp-67",
                "name": "Geofferson Sampang Group",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-139"
              },
              {
                "id": "ou-corp-68",
                "name": "Francis Murchante Group",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-140"
              },
              {
                "id": "ou-corp-69",
                "name": "DLSI",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-142"
              },
              {
                "id": "ou-corp-70",
                "name": "DigiLearn",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-144"
              },
              {
                "id": "ou-corp-71",
                "name": "Diana Rizaldo Group",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-145"
              },
              {
                "id": "ou-corp-72",
                "name": "Deopante group",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-147"
              },
              {
                "id": "ou-corp-73",
                "name": "April De La Cruz Group",
                "type": "Section",
                "parentId": "ou-corp-50",
                "children": [],
                "headPositionId": "p-corp-150"
              }
            ],
            "headPositionId": "p-corp-106"
          },
          {
            "id": "ou-corp-74",
            "name": "Product Management Group",
            "type": "Department",
            "parentId": "ou-corp-49",
            "children": [
              {
                "id": "ou-corp-75",
                "name": "PDI",
                "type": "Section",
                "parentId": "ou-corp-74",
                "children": [],
                "headPositionId": "p-corp-153"
              }
            ],
            "headPositionId": "p-corp-153"
          }
        ],
        "headPositionId": "p-corp-106"
      },
      {
        "id": "ou-corp-76",
        "name": "Editorial/Art",
        "type": "Division",
        "parentId": "root-corporate",
        "children": [
          {
            "id": "ou-corp-77",
            "name": "Digitization",
            "type": "Department",
            "parentId": "ou-corp-76",
            "children": [
              {
                "id": "ou-corp-78",
                "name": "DIGI",
                "type": "Section",
                "parentId": "ou-corp-77",
                "children": [],
                "headPositionId": "p-corp-154"
              }
            ],
            "headPositionId": "p-corp-154"
          },
          {
            "id": "ou-corp-79",
            "name": "Multimedia Content Unit",
            "type": "Department",
            "parentId": "ou-corp-76",
            "children": [
              {
                "id": "ou-corp-80",
                "name": "MCU",
                "type": "Section",
                "parentId": "ou-corp-79",
                "children": [],
                "headPositionId": "p-corp-156"
              }
            ],
            "headPositionId": "p-corp-156"
          },
          {
            "id": "ou-corp-81",
            "name": "Managing Unit",
            "type": "Department",
            "parentId": "ou-corp-76",
            "children": [
              {
                "id": "ou-corp-82",
                "name": "MU",
                "type": "Section",
                "parentId": "ou-corp-81",
                "children": [],
                "headPositionId": "p-corp-160"
              }
            ],
            "headPositionId": "p-corp-160"
          },
          {
            "id": "ou-corp-83",
            "name": "Art",
            "type": "Department",
            "parentId": "ou-corp-76",
            "children": [
              {
                "id": "ou-corp-84",
                "name": "Art",
                "type": "Section",
                "parentId": "ou-corp-83",
                "children": [],
                "headPositionId": "p-corp-171"
              }
            ],
            "headPositionId": "p-corp-171"
          },
          {
            "id": "ou-corp-85",
            "name": "P4 Production",
            "type": "Department",
            "parentId": "ou-corp-76",
            "children": [
              {
                "id": "ou-corp-86",
                "name": "Textbook Production",
                "type": "Section",
                "parentId": "ou-corp-85",
                "children": [],
                "headPositionId": "p-corp-174"
              }
            ],
            "headPositionId": "p-corp-174"
          },
          {
            "id": "ou-corp-87",
            "name": "SEM",
            "type": "Department",
            "parentId": "ou-corp-76",
            "children": [
              {
                "id": "ou-corp-88",
                "name": "SEM",
                "type": "Section",
                "parentId": "ou-corp-87",
                "children": [],
                "headPositionId": "p-corp-178"
              }
            ],
            "headPositionId": "p-corp-178"
          },
          {
            "id": "ou-corp-89",
            "name": "Research and Development Unit",
            "type": "Department",
            "parentId": "ou-corp-76",
            "children": [
              {
                "id": "ou-corp-90",
                "name": "R&D",
                "type": "Section",
                "parentId": "ou-corp-89",
                "children": [],
                "headPositionId": "p-corp-180"
              }
            ],
            "headPositionId": "p-corp-180"
          }
        ],
        "headPositionId": "p-corp-160"
      },
      {
        "id": "ou-corp-91",
        "name": "DOC",
        "type": "Division",
        "parentId": "root-corporate",
        "children": [
          {
            "id": "ou-corp-92",
            "name": "DOC-eLearning",
            "type": "Department",
            "parentId": "ou-corp-91",
            "children": [
              {
                "id": "ou-corp-93",
                "name": "DLSI",
                "type": "Section",
                "parentId": "ou-corp-92",
                "children": [],
                "headPositionId": "p-corp-185"
              }
            ],
            "headPositionId": "p-corp-185"
          },
          {
            "id": "ou-corp-94",
            "name": "Print",
            "type": "Department",
            "parentId": "ou-corp-91",
            "children": [
              {
                "id": "ou-corp-95",
                "name": "DLSI",
                "type": "Section",
                "parentId": "ou-corp-94",
                "children": [],
                "headPositionId": "p-corp-191"
              }
            ],
            "headPositionId": "p-corp-191"
          },
          {
            "id": "ou-corp-96",
            "name": "Traffic",
            "type": "Department",
            "parentId": "ou-corp-91",
            "children": [
              {
                "id": "ou-corp-97",
                "name": "Traffic",
                "type": "Section",
                "parentId": "ou-corp-96",
                "children": [],
                "headPositionId": "p-corp-194"
              },
              {
                "id": "ou-corp-98",
                "name": "DLSI",
                "type": "Section",
                "parentId": "ou-corp-96",
                "children": [],
                "headPositionId": "p-corp-197"
              }
            ],
            "headPositionId": "p-corp-197"
          },
          {
            "id": "ou-corp-99",
            "name": "Operations Support",
            "type": "Department",
            "parentId": "ou-corp-91",
            "children": [
              {
                "id": "ou-corp-100",
                "name": "DLSI",
                "type": "Section",
                "parentId": "ou-corp-99",
                "children": [],
                "headPositionId": "p-corp-201"
              }
            ],
            "headPositionId": "p-corp-201"
          },
          {
            "id": "ou-corp-101",
            "name": "Warehouse",
            "type": "Department",
            "parentId": "ou-corp-91",
            "children": [
              {
                "id": "ou-corp-102",
                "name": "Warehouse",
                "type": "Section",
                "parentId": "ou-corp-101",
                "children": [],
                "headPositionId": "p-corp-205"
              },
              {
                "id": "ou-corp-103",
                "name": "DLSI",
                "type": "Section",
                "parentId": "ou-corp-101",
                "children": [],
                "headPositionId": "p-corp-207"
              }
            ],
            "headPositionId": "p-corp-207"
          },
          {
            "id": "ou-corp-104",
            "name": "Office Services",
            "type": "Department",
            "parentId": "ou-corp-91",
            "children": [
              {
                "id": "ou-corp-105",
                "name": "DLSI",
                "type": "Section",
                "parentId": "ou-corp-104",
                "children": [],
                "headPositionId": "p-corp-212"
              }
            ],
            "headPositionId": "p-corp-212"
          }
        ],
        "headPositionId": "p-corp-191"
      },
      {
        "id": "ou-corp-106",
        "name": "DigiLearn",
        "type": "Division",
        "parentId": "root-corporate",
        "children": [
          {
            "id": "ou-corp-107",
            "name": "Sales",
            "type": "Department",
            "parentId": "ou-corp-106",
            "children": [],
            "headPositionId": "p-corp-215"
          }
        ],
        "headPositionId": "p-corp-215"
      },
      {
        "id": "ou-corp-108",
        "name": "Corporate Services",
        "type": "Division",
        "parentId": "root-corporate",
        "children": [
          {
            "id": "ou-corp-109",
            "name": "Employee Engagement Unit",
            "type": "Department",
            "parentId": "ou-corp-108",
            "children": [
              {
                "id": "ou-corp-110",
                "name": "DLSI",
                "type": "Section",
                "parentId": "ou-corp-109",
                "children": [],
                "headPositionId": "p-corp-218"
              }
            ],
            "headPositionId": "p-corp-218"
          },
          {
            "id": "ou-corp-111",
            "name": "Information Technology",
            "type": "Department",
            "parentId": "ou-corp-108",
            "children": [
              {
                "id": "ou-corp-112",
                "name": "DLSI",
                "type": "Section",
                "parentId": "ou-corp-111",
                "children": [],
                "headPositionId": "p-corp-232"
              }
            ],
            "headPositionId": "p-corp-232"
          },
          {
            "id": "ou-corp-113",
            "name": "Sales",
            "type": "Department",
            "parentId": "ou-corp-108",
            "children": [
              {
                "id": "ou-corp-114",
                "name": "DLSI",
                "type": "Section",
                "parentId": "ou-corp-113",
                "children": [],
                "headPositionId": "p-corp-234"
              }
            ],
            "headPositionId": "p-corp-234"
          },
          {
            "id": "ou-corp-115",
            "name": "Human Resource Management",
            "type": "Department",
            "parentId": "ou-corp-108",
            "children": [
              {
                "id": "ou-corp-116",
                "name": "DLSI",
                "type": "Section",
                "parentId": "ou-corp-115",
                "children": [],
                "headPositionId": "p-corp-236"
              }
            ],
            "headPositionId": "p-corp-264"
          },
          {
            "id": "ou-corp-117",
            "name": "Credit and Collections",
            "type": "Department",
            "parentId": "ou-corp-108",
            "children": [
              {
                "id": "ou-corp-118",
                "name": "DLSI",
                "type": "Section",
                "parentId": "ou-corp-117",
                "children": [],
                "headPositionId": "p-corp-239"
              }
            ],
            "headPositionId": "p-corp-239"
          },
          {
            "id": "ou-corp-119",
            "name": "Office Services",
            "type": "Department",
            "parentId": "ou-corp-108",
            "children": [
              {
                "id": "ou-corp-120",
                "name": "Office Services",
                "type": "Section",
                "parentId": "ou-corp-119",
                "children": [],
                "headPositionId": "p-corp-240"
              },
              {
                "id": "ou-corp-121",
                "name": "DLSI",
                "type": "Section",
                "parentId": "ou-corp-119",
                "children": [],
                "headPositionId": "p-corp-241"
              }
            ],
            "headPositionId": "p-corp-241"
          },
          {
            "id": "ou-corp-122",
            "name": "Accounting",
            "type": "Department",
            "parentId": "ou-corp-108",
            "children": [
              {
                "id": "ou-corp-123",
                "name": "DLSI",
                "type": "Section",
                "parentId": "ou-corp-122",
                "children": [],
                "headPositionId": "p-corp-258"
              },
              {
                "id": "ou-corp-124",
                "name": "Accounting",
                "type": "Section",
                "parentId": "ou-corp-122",
                "children": [],
                "headPositionId": "p-corp-260"
              }
            ],
            "headPositionId": "p-corp-258"
          },
          {
            "id": "ou-corp-125",
            "name": "Office of the President",
            "type": "Department",
            "parentId": "ou-corp-108",
            "children": [],
            "headPositionId": "p-corp-261"
          }
        ],
        "headPositionId": "p-corp-263"
      }
    ],
    "headPositionId": "p-corp-86"
  }
];

export const MOCK_RANKS: Rank[] = [
  {
    "id": "r-x",
    "name": "Executive",
    "order": 1,
    "color": "bg-black",
    "mode": "leveled",
    "levels": [
      {
        "id": "rl-x-8",
        "code": "8",
        "positions": [
          {
            "id": "rp-corp-24",
            "name": "President",
            "salaryGradeId": "sg-18"
          },
          {
            "id": "rp-corp-25",
            "name": "Executive Vice President",
            "salaryGradeId": "sg-18"
          },
          {
            "id": "rp-corp-26",
            "name": "Executive Director",
            "salaryGradeId": "sg-18"
          }
        ]
      },
      {
        "id": "rl-x-7",
        "code": "7",
        "positions": [
          {
            "id": "rp-corp-8",
            "name": "Vice President",
            "salaryGradeId": "sg-16"
          },
          {
            "id": "rp-corp-27",
            "name": "Executive Director",
            "salaryGradeId": "sg-16"
          }
        ]
      }
    ]
  },
  {
    "id": "r-m",
    "name": "Management",
    "order": 2,
    "color": "bg-rose-600",
    "mode": "leveled",
    "levels": [
      {
        "id": "rl-m-6A",
        "code": "6A",
        "positions": [
          {
            "id": "rp-corp-2",
            "name": "Sales Manager",
            "salaryGradeId": "sg-14"
          },
          {
            "id": "rp-corp-12",
            "name": "Vice President",
            "salaryGradeId": "sg-14"
          },
          {
            "id": "rp-corp-18",
            "name": "Corporate Communication Manager",
            "salaryGradeId": "sg-14"
          },
          {
            "id": "rp-corp-21",
            "name": "Product Manager- Print",
            "salaryGradeId": "sg-14"
          },
          {
            "id": "rp-corp-23",
            "name": "Product Manager- Digital",
            "salaryGradeId": "sg-14"
          },
          {
            "id": "rp-corp-29",
            "name": "Marketing Services Manager",
            "salaryGradeId": "sg-14"
          },
          {
            "id": "rp-corp-36",
            "name": "Curriculum and Content Manager",
            "salaryGradeId": "sg-14"
          },
          {
            "id": "rp-corp-39",
            "name": "LIS Operation and Implementation Manager",
            "salaryGradeId": "sg-14"
          },
          {
            "id": "rp-corp-47",
            "name": "Manuscript Evaluation Manager",
            "salaryGradeId": "sg-14"
          },
          {
            "id": "rp-corp-58",
            "name": "Art Director",
            "salaryGradeId": "sg-14"
          },
          {
            "id": "rp-corp-60",
            "name": "Editor-In-Chief",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-60-1",
                "name": "Editor-In-Chief I",
                "salaryGradeId": "sg-14"
              },
              {
                "id": "tl-rp-corp-60-2",
                "name": "Editor-In-Chief II",
                "salaryGradeId": "sg-16"
              },
              {
                "id": "tl-rp-corp-60-3",
                "name": "Editor-In-Chief III",
                "salaryGradeId": "sg-18"
              }
            ]
          },
          {
            "id": "rp-corp-63",
            "name": "Editor in Chief (SEM)",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-63-1",
                "name": "Editor in Chief (SEM) I",
                "salaryGradeId": "sg-14"
              },
              {
                "id": "tl-rp-corp-63-2",
                "name": "Editor in Chief (SEM) II",
                "salaryGradeId": "sg-16"
              },
              {
                "id": "tl-rp-corp-63-3",
                "name": "Editor in Chief (SEM) III",
                "salaryGradeId": "sg-18"
              }
            ]
          },
          {
            "id": "rp-corp-72",
            "name": "Production Manager",
            "salaryGradeId": "sg-14"
          },
          {
            "id": "rp-corp-87",
            "name": "Office Services Manager",
            "salaryGradeId": "sg-14"
          },
          {
            "id": "rp-corp-103",
            "name": "IT Manager",
            "salaryGradeId": "sg-14"
          },
          {
            "id": "rp-corp-123",
            "name": "Accounting Manager",
            "salaryGradeId": "sg-14"
          }
        ]
      },
      {
        "id": "rl-m-6B",
        "code": "6B",
        "positions": [
          {
            "id": "rp-corp-10",
            "name": "Area Vice President",
            "salaryGradeId": "sg-12"
          }
        ]
      }
    ]
  },
  {
    "id": "r-sup",
    "name": "Supervisory",
    "order": 3,
    "color": "bg-amber-600",
    "mode": "leveled",
    "levels": [
      {
        "id": "rl-sup-5",
        "code": "5",
        "positions": [
          {
            "id": "rp-corp-3",
            "name": "CS Supervisor",
            "salaryGradeId": "sg-10"
          },
          {
            "id": "rp-corp-14",
            "name": "Media Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-14-1",
                "name": "Media Specialist I",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-14-2",
                "name": "Media Specialist II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-14-3",
                "name": "Media Specialist III",
                "salaryGradeId": "sg-16"
              }
            ]
          },
          {
            "id": "rp-corp-16",
            "name": "Online Media Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-16-1",
                "name": "Online Media Specialist I",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-16-2",
                "name": "Online Media Specialist II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-16-3",
                "name": "Online Media Specialist III",
                "salaryGradeId": "sg-16"
              }
            ]
          },
          {
            "id": "rp-corp-17",
            "name": "Events Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-17-1",
                "name": "Events Specialist I",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-17-2",
                "name": "Events Specialist II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-17-3",
                "name": "Events Specialist III",
                "salaryGradeId": "sg-16"
              }
            ]
          },
          {
            "id": "rp-corp-19",
            "name": "Product Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-19-1",
                "name": "Product Specialist I",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-19-2",
                "name": "Product Specialist II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-19-3",
                "name": "Product Specialist III",
                "salaryGradeId": "sg-16"
              }
            ]
          },
          {
            "id": "rp-corp-20",
            "name": "PDI Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-20-1",
                "name": "PDI Specialist I",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-20-2",
                "name": "PDI Specialist II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-20-3",
                "name": "PDI Specialist III",
                "salaryGradeId": "sg-16"
              }
            ]
          },
          {
            "id": "rp-corp-22",
            "name": "Product Specialist - Textbook",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-22-1",
                "name": "Product Specialist - Textbook I",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-22-2",
                "name": "Product Specialist - Textbook II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-22-3",
                "name": "Product Specialist - Textbook III",
                "salaryGradeId": "sg-16"
              }
            ]
          },
          {
            "id": "rp-corp-37",
            "name": "E-Learning Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-37-1",
                "name": "E-Learning Specialist I",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-37-2",
                "name": "E-Learning Specialist II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-37-3",
                "name": "E-Learning Specialist III",
                "salaryGradeId": "sg-16"
              }
            ]
          },
          {
            "id": "rp-corp-38",
            "name": "Training Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-38-1",
                "name": "Training Specialist I",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-38-2",
                "name": "Training Specialist II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-38-3",
                "name": "Training Specialist III",
                "salaryGradeId": "sg-16"
              }
            ]
          },
          {
            "id": "rp-corp-41",
            "name": "Senior Digitization Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-41-1",
                "name": "Senior Digitization Specialist I",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-41-2",
                "name": "Senior Digitization Specialist II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-41-3",
                "name": "Senior Digitization Specialist III",
                "salaryGradeId": "sg-16"
              }
            ]
          },
          {
            "id": "rp-corp-44",
            "name": "Instructional Design Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-44-1",
                "name": "Instructional Design Specialist I",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-44-2",
                "name": "Instructional Design Specialist II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-44-3",
                "name": "Instructional Design Specialist III",
                "salaryGradeId": "sg-16"
              }
            ]
          },
          {
            "id": "rp-corp-45",
            "name": "Sr. Development Editor",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-45-1",
                "name": "Sr. Development Editor I",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-45-2",
                "name": "Sr. Development Editor II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-45-3",
                "name": "Sr. Development Editor III",
                "salaryGradeId": "sg-16"
              }
            ]
          },
          {
            "id": "rp-corp-57",
            "name": "Art Supervisor",
            "salaryGradeId": "sg-10"
          },
          {
            "id": "rp-corp-61",
            "name": "Copy Editor",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-61-1",
                "name": "Copy Editor I",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-61-2",
                "name": "Copy Editor II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-61-3",
                "name": "Copy Editor III",
                "salaryGradeId": "sg-16"
              }
            ]
          },
          {
            "id": "rp-corp-66",
            "name": "Technical Support Supervisor",
            "salaryGradeId": "sg-10"
          },
          {
            "id": "rp-corp-70",
            "name": "Cabling Supervisor",
            "salaryGradeId": "sg-10"
          },
          {
            "id": "rp-corp-73",
            "name": "Print Supervisor",
            "salaryGradeId": "sg-10"
          },
          {
            "id": "rp-corp-76",
            "name": "Traffic Supervisor",
            "salaryGradeId": "sg-10"
          },
          {
            "id": "rp-corp-79",
            "name": "Operations Support Supervisor",
            "salaryGradeId": "sg-10"
          },
          {
            "id": "rp-corp-83",
            "name": "Warehouse Supervisor",
            "salaryGradeId": "sg-10"
          },
          {
            "id": "rp-corp-93",
            "name": "Learning and Development Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-93-1",
                "name": "Learning and Development Specialist I",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-93-2",
                "name": "Learning and Development Specialist II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-93-3",
                "name": "Learning and Development Specialist III",
                "salaryGradeId": "sg-16"
              }
            ]
          },
          {
            "id": "rp-corp-94",
            "name": "Technical Analyst",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-94-1",
                "name": "Technical Analyst I",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-94-2",
                "name": "Technical Analyst II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-94-3",
                "name": "Technical Analyst III",
                "salaryGradeId": "sg-16"
              }
            ]
          },
          {
            "id": "rp-corp-104",
            "name": "Data Center Supervisor",
            "salaryGradeId": "sg-10"
          },
          {
            "id": "rp-corp-106",
            "name": "HRMD Supervisor",
            "salaryGradeId": "sg-10"
          },
          {
            "id": "rp-corp-107",
            "name": "HR Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-107-1",
                "name": "HR Specialist I",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-107-2",
                "name": "HR Specialist II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-107-3",
                "name": "HR Specialist III",
                "salaryGradeId": "sg-16"
              }
            ]
          },
          {
            "id": "rp-corp-117",
            "name": "Database Mgmt / Admin Supervisor",
            "salaryGradeId": "sg-10"
          },
          {
            "id": "rp-corp-120",
            "name": "AR & Gen Accounting Supervisor",
            "salaryGradeId": "sg-10"
          },
          {
            "id": "rp-corp-121",
            "name": "AR & Compliance Supervisor",
            "salaryGradeId": "sg-10"
          },
          {
            "id": "rp-corp-122",
            "name": "AP & Compliance Supervisor",
            "salaryGradeId": "sg-10"
          }
        ]
      }
    ]
  },
  {
    "id": "r-f",
    "name": "Rank & File",
    "order": 4,
    "color": "bg-blue-500",
    "mode": "leveled",
    "levels": [
      {
        "id": "rl-f-4A",
        "code": "4A",
        "positions": [
          {
            "id": "rp-corp-0",
            "name": "Customer Service Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-0-1",
                "name": "Customer Service Specialist I",
                "salaryGradeId": "sg-8"
              },
              {
                "id": "tl-rp-corp-0-2",
                "name": "Customer Service Specialist II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-0-3",
                "name": "Customer Service Specialist III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-13",
            "name": "Multimedia Specialist (Events)",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-13-1",
                "name": "Multimedia Specialist (Events) I",
                "salaryGradeId": "sg-8"
              },
              {
                "id": "tl-rp-corp-13-2",
                "name": "Multimedia Specialist (Events) II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-13-3",
                "name": "Multimedia Specialist (Events) III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-42",
            "name": "Digitization Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-42-1",
                "name": "Digitization Specialist I",
                "salaryGradeId": "sg-8"
              },
              {
                "id": "tl-rp-corp-42-2",
                "name": "Digitization Specialist II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-42-3",
                "name": "Digitization Specialist III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-49",
            "name": "Development Editor",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-49-1",
                "name": "Development Editor I",
                "salaryGradeId": "sg-8"
              },
              {
                "id": "tl-rp-corp-49-2",
                "name": "Development Editor II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-49-3",
                "name": "Development Editor III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-51",
            "name": "Technical Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-51-1",
                "name": "Technical Specialist I",
                "salaryGradeId": "sg-8"
              },
              {
                "id": "tl-rp-corp-51-2",
                "name": "Technical Specialist II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-51-3",
                "name": "Technical Specialist III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-52",
            "name": "Sr. Layout Artist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-52-1",
                "name": "Sr. Layout Artist I",
                "salaryGradeId": "sg-8"
              },
              {
                "id": "tl-rp-corp-52-2",
                "name": "Sr. Layout Artist II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-52-3",
                "name": "Sr. Layout Artist III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-59",
            "name": "Book Editor",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-59-1",
                "name": "Book Editor I",
                "salaryGradeId": "sg-8"
              },
              {
                "id": "tl-rp-corp-59-2",
                "name": "Book Editor II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-59-3",
                "name": "Book Editor III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-62",
            "name": "Magazine Editor",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-62-1",
                "name": "Magazine Editor I",
                "salaryGradeId": "sg-8"
              },
              {
                "id": "tl-rp-corp-62-2",
                "name": "Magazine Editor II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-62-3",
                "name": "Magazine Editor III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-67",
            "name": "Harwdware Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-67-1",
                "name": "Harwdware Specialist I",
                "salaryGradeId": "sg-8"
              },
              {
                "id": "tl-rp-corp-67-2",
                "name": "Harwdware Specialist II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-67-3",
                "name": "Harwdware Specialist III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-92",
            "name": "Employee Engagement Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-92-1",
                "name": "Employee Engagement Specialist I",
                "salaryGradeId": "sg-8"
              },
              {
                "id": "tl-rp-corp-92-2",
                "name": "Employee Engagement Specialist II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-92-3",
                "name": "Employee Engagement Specialist III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-95",
            "name": "Systems Administrator",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-95-1",
                "name": "Systems Administrator I",
                "salaryGradeId": "sg-8"
              },
              {
                "id": "tl-rp-corp-95-2",
                "name": "Systems Administrator II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-95-3",
                "name": "Systems Administrator III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-101",
            "name": "Senior Developer",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-101-1",
                "name": "Senior Developer I",
                "salaryGradeId": "sg-9"
              },
              {
                "id": "tl-rp-corp-101-2",
                "name": "Senior Developer II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-101-3",
                "name": "Senior Developer III",
                "salaryGradeId": "sg-11"
              }
            ]
          },
          {
            "id": "rp-corp-102",
            "name": "Network Administrator",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-102-1",
                "name": "Network Administrator I",
                "salaryGradeId": "sg-8"
              },
              {
                "id": "tl-rp-corp-102-2",
                "name": "Network Administrator II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-102-3",
                "name": "Network Administrator III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-105",
            "name": "HR Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-105-1",
                "name": "HR Specialist I",
                "salaryGradeId": "sg-8"
              },
              {
                "id": "tl-rp-corp-105-2",
                "name": "HR Specialist II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-105-3",
                "name": "HR Specialist III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-108",
            "name": "Field Auditor",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-108-1",
                "name": "Field Auditor I",
                "salaryGradeId": "sg-8"
              },
              {
                "id": "tl-rp-corp-108-2",
                "name": "Field Auditor II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-108-3",
                "name": "Field Auditor III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-119",
            "name": "Cashier / Cash Management",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-119-1",
                "name": "Cashier / Cash Management I",
                "salaryGradeId": "sg-8"
              },
              {
                "id": "tl-rp-corp-119-2",
                "name": "Cashier / Cash Management II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-119-3",
                "name": "Cashier / Cash Management III",
                "salaryGradeId": "sg-1"
              }
            ]
          }
        ]
      },
      {
        "id": "rl-f-4B",
        "code": "4B",
        "positions": [
          {
            "id": "rp-corp-43",
            "name": "Multimedia Content Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-43-1",
                "name": "Multimedia Content Specialist I",
                "salaryGradeId": "sg-6"
              },
              {
                "id": "tl-rp-corp-43-2",
                "name": "Multimedia Content Specialist II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-43-3",
                "name": "Multimedia Content Specialist III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-48",
            "name": "Junior Development Editor",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-48-1",
                "name": "Junior Development Editor I",
                "salaryGradeId": "sg-6"
              },
              {
                "id": "tl-rp-corp-48-2",
                "name": "Junior Development Editor II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-48-3",
                "name": "Junior Development Editor III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-54",
            "name": "Lay-out Artist",
            "salaryGradeId": "sg-6"
          },
          {
            "id": "rp-corp-56",
            "name": "Graphic Artist",
            "salaryGradeId": "sg-6"
          },
          {
            "id": "rp-corp-69",
            "name": "E-learning Aftersales Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-69-1",
                "name": "E-learning Aftersales Specialist I",
                "salaryGradeId": "sg-6"
              },
              {
                "id": "tl-rp-corp-69-2",
                "name": "E-learning Aftersales Specialist II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-69-3",
                "name": "E-learning Aftersales Specialist III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-74",
            "name": "Print Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-74-1",
                "name": "Print Specialist I",
                "salaryGradeId": "sg-6"
              },
              {
                "id": "tl-rp-corp-74-2",
                "name": "Print Specialist II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-74-3",
                "name": "Print Specialist III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-96",
            "name": "Quality Assurance Analyst",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-96-1",
                "name": "Quality Assurance Analyst I",
                "salaryGradeId": "sg-6"
              },
              {
                "id": "tl-rp-corp-96-2",
                "name": "Quality Assurance Analyst II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-96-3",
                "name": "Quality Assurance Analyst III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-97",
            "name": "Junior Programmer",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-97-1",
                "name": "Junior Programmer I",
                "salaryGradeId": "sg-6"
              },
              {
                "id": "tl-rp-corp-97-2",
                "name": "Junior Programmer II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-97-3",
                "name": "Junior Programmer III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-98",
            "name": "Junior Developer",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-98-1",
                "name": "Junior Developer I",
                "salaryGradeId": "sg-5"
              },
              {
                "id": "tl-rp-corp-98-2",
                "name": "Junior Developer II",
                "salaryGradeId": "sg-6"
              },
              {
                "id": "tl-rp-corp-98-3",
                "name": "Junior Developer III",
                "salaryGradeId": "sg-7"
              },
              {
                "id": "tl-rp-corp-98-4",
                "name": "Junior Developer IV",
                "salaryGradeId": "sg-8"
              }
            ]
          },
          {
            "id": "rp-corp-110",
            "name": "Office Services Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-110-1",
                "name": "Office Services Specialist I",
                "salaryGradeId": "sg-6"
              },
              {
                "id": "tl-rp-corp-110-2",
                "name": "Office Services Specialist II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-110-3",
                "name": "Office Services Specialist III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-111",
            "name": "Maintenance Crew",
            "salaryGradeId": "sg-6"
          },
          {
            "id": "rp-corp-113",
            "name": "AR Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-113-1",
                "name": "AR Specialist I",
                "salaryGradeId": "sg-6"
              },
              {
                "id": "tl-rp-corp-113-2",
                "name": "AR Specialist II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-113-3",
                "name": "AR Specialist III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-114",
            "name": "AP Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-114-1",
                "name": "AP Specialist I",
                "salaryGradeId": "sg-6"
              },
              {
                "id": "tl-rp-corp-114-2",
                "name": "AP Specialist II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-114-3",
                "name": "AP Specialist III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-118",
            "name": "Data Analyst",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-118-1",
                "name": "Data Analyst I",
                "salaryGradeId": "sg-6"
              },
              {
                "id": "tl-rp-corp-118-2",
                "name": "Data Analyst II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-118-3",
                "name": "Data Analyst III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-124",
            "name": "Accounting Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-124-1",
                "name": "Accounting Specialist I",
                "salaryGradeId": "sg-6"
              },
              {
                "id": "tl-rp-corp-124-2",
                "name": "Accounting Specialist II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-124-3",
                "name": "Accounting Specialist III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-125",
            "name": "Executive Assistant",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-125-1",
                "name": "Executive Assistant I",
                "salaryGradeId": "sg-6"
              },
              {
                "id": "tl-rp-corp-125-2",
                "name": "Executive Assistant II",
                "salaryGradeId": "sg-10"
              },
              {
                "id": "tl-rp-corp-125-3",
                "name": "Executive Assistant III",
                "salaryGradeId": "sg-1"
              }
            ]
          }
        ]
      },
      {
        "id": "rl-f-3",
        "code": "3",
        "positions": [
          {
            "id": "rp-corp-15",
            "name": "CMC Assistant",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-15-1",
                "name": "CMC Assistant I",
                "salaryGradeId": "sg-5"
              },
              {
                "id": "tl-rp-corp-15-2",
                "name": "CMC Assistant II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-15-3",
                "name": "CMC Assistant III",
                "salaryGradeId": "sg-10"
              }
            ]
          },
          {
            "id": "rp-corp-30",
            "name": "Marketing Services Assistant",
            "salaryGradeId": "sg-5"
          },
          {
            "id": "rp-corp-50",
            "name": "Administrative Assistant",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-50-1",
                "name": "Administrative Assistant I",
                "salaryGradeId": "sg-5"
              },
              {
                "id": "tl-rp-corp-50-2",
                "name": "Administrative Assistant II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-50-3",
                "name": "Administrative Assistant III",
                "salaryGradeId": "sg-10"
              }
            ]
          },
          {
            "id": "rp-corp-55",
            "name": "Illustrator",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-55-1",
                "name": "Illustrator I",
                "salaryGradeId": "sg-5"
              },
              {
                "id": "tl-rp-corp-55-2",
                "name": "Illustrator II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-55-3",
                "name": "Illustrator III",
                "salaryGradeId": "sg-10"
              }
            ]
          },
          {
            "id": "rp-corp-68",
            "name": "e-Learning Cabling & Hardware Assistant",
            "salaryGradeId": "sg-5"
          },
          {
            "id": "rp-corp-77",
            "name": "Traffic Assistant",
            "salaryGradeId": "sg-5"
          },
          {
            "id": "rp-corp-78",
            "name": "Delivery Assistant",
            "salaryGradeId": "sg-5"
          },
          {
            "id": "rp-corp-80",
            "name": "Operations Support Assistant",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-80-1",
                "name": "Operations Support Assistant I",
                "salaryGradeId": "sg-5"
              },
              {
                "id": "tl-rp-corp-80-2",
                "name": "Operations Support Assistant II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-80-3",
                "name": "Operations Support Assistant III",
                "salaryGradeId": "sg-10"
              }
            ]
          },
          {
            "id": "rp-corp-81",
            "name": "Operations Assistant",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-81-1",
                "name": "Operations Assistant I",
                "salaryGradeId": "sg-5"
              },
              {
                "id": "tl-rp-corp-81-2",
                "name": "Operations Assistant II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-81-3",
                "name": "Operations Assistant III",
                "salaryGradeId": "sg-10"
              }
            ]
          },
          {
            "id": "rp-corp-82",
            "name": "Office and Purchasing Assistant",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-82-1",
                "name": "Office and Purchasing Assistant I",
                "salaryGradeId": "sg-5"
              },
              {
                "id": "tl-rp-corp-82-2",
                "name": "Office and Purchasing Assistant II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-82-3",
                "name": "Office and Purchasing Assistant III",
                "salaryGradeId": "sg-10"
              }
            ]
          },
          {
            "id": "rp-corp-85",
            "name": "Warehouse Assistant",
            "salaryGradeId": "sg-5"
          },
          {
            "id": "rp-corp-99",
            "name": "IT Systems Support",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-99-1",
                "name": "IT Systems Support I",
                "salaryGradeId": "sg-5"
              },
              {
                "id": "tl-rp-corp-99-2",
                "name": "IT Systems Support II",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-99-3",
                "name": "IT Systems Support III",
                "salaryGradeId": "sg-10"
              }
            ]
          },
          {
            "id": "rp-corp-100",
            "name": "Technical Support Technician",
            "salaryGradeId": "sg-5"
          },
          {
            "id": "rp-corp-115",
            "name": "Accounting Assistant",
            "salaryGradeId": "sg-5"
          }
        ]
      },
      {
        "id": "rl-f-2",
        "code": "2",
        "positions": [
          {
            "id": "rp-corp-5",
            "name": "Driver",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-5-1",
                "name": "Driver I",
                "salaryGradeId": "sg-3"
              },
              {
                "id": "tl-rp-corp-5-2",
                "name": "Driver II",
                "salaryGradeId": "sg-5"
              },
              {
                "id": "tl-rp-corp-5-3",
                "name": "Driver III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-9",
            "name": "Marketing Clerk",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-9-1",
                "name": "Marketing Clerk I",
                "salaryGradeId": "sg-3"
              },
              {
                "id": "tl-rp-corp-9-2",
                "name": "Marketing Clerk II",
                "salaryGradeId": "sg-5"
              },
              {
                "id": "tl-rp-corp-9-3",
                "name": "Marketing Clerk III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-71",
            "name": "Cabling Assistant",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-71-1",
                "name": "Cabling Assistant I",
                "salaryGradeId": "sg-3"
              },
              {
                "id": "tl-rp-corp-71-2",
                "name": "Cabling Assistant II",
                "salaryGradeId": "sg-5"
              },
              {
                "id": "tl-rp-corp-71-3",
                "name": "Cabling Assistant III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-84",
            "name": "Warehouse Clerk",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-84-1",
                "name": "Warehouse Clerk I",
                "salaryGradeId": "sg-3"
              },
              {
                "id": "tl-rp-corp-84-2",
                "name": "Warehouse Clerk II",
                "salaryGradeId": "sg-5"
              },
              {
                "id": "tl-rp-corp-84-3",
                "name": "Warehouse Clerk III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-90",
            "name": "Sales Processor",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-90-1",
                "name": "Sales Processor I",
                "salaryGradeId": "sg-3"
              },
              {
                "id": "tl-rp-corp-90-2",
                "name": "Sales Processor II",
                "salaryGradeId": "sg-5"
              },
              {
                "id": "tl-rp-corp-90-3",
                "name": "Sales Processor III",
                "salaryGradeId": "sg-1"
              }
            ]
          },
          {
            "id": "rp-corp-112",
            "name": "Maintenance Crew",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-112-1",
                "name": "Maintenance Crew I",
                "salaryGradeId": "sg-3"
              },
              {
                "id": "tl-rp-corp-112-2",
                "name": "Maintenance Crew II",
                "salaryGradeId": "sg-5"
              },
              {
                "id": "tl-rp-corp-112-3",
                "name": "Maintenance Crew III",
                "salaryGradeId": "sg-1"
              }
            ]
          }
        ]
      },
      {
        "id": "rl-f-1",
        "code": "1",
        "positions": [
          {
            "id": "rp-corp-6",
            "name": "Marketing Associate",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-6-1",
                "name": "Marketing Associate I",
                "salaryGradeId": "sg-2"
              },
              {
                "id": "tl-rp-corp-6-2",
                "name": "Marketing Associate II",
                "salaryGradeId": "sg-3"
              },
              {
                "id": "tl-rp-corp-6-3",
                "name": "Marketing Associate III",
                "salaryGradeId": "sg-5"
              }
            ]
          },
          {
            "id": "rp-corp-11",
            "name": "Warehouse Helper",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-11-1",
                "name": "Warehouse Helper I",
                "salaryGradeId": "sg-2"
              },
              {
                "id": "tl-rp-corp-11-2",
                "name": "Warehouse Helper II",
                "salaryGradeId": "sg-3"
              },
              {
                "id": "tl-rp-corp-11-3",
                "name": "Warehouse Helper III",
                "salaryGradeId": "sg-5"
              }
            ]
          },
          {
            "id": "rp-corp-28",
            "name": "Telesales Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-28-1",
                "name": "Telesales Specialist I",
                "salaryGradeId": "sg-2"
              },
              {
                "id": "tl-rp-corp-28-2",
                "name": "Telesales Specialist II",
                "salaryGradeId": "sg-3"
              },
              {
                "id": "tl-rp-corp-28-3",
                "name": "Telesales Specialist III",
                "salaryGradeId": "sg-5"
              }
            ]
          },
          {
            "id": "rp-corp-40",
            "name": "LIS - Cadet",
            "salaryGradeId": "sg-2"
          },
          {
            "id": "rp-corp-46",
            "name": "Messenger",
            "salaryGradeId": "sg-2"
          },
          {
            "id": "rp-corp-53",
            "name": "Production Aide",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-53-1",
                "name": "Production Aide I",
                "salaryGradeId": "sg-2"
              },
              {
                "id": "tl-rp-corp-53-2",
                "name": "Production Aide II",
                "salaryGradeId": "sg-3"
              },
              {
                "id": "tl-rp-corp-53-3",
                "name": "Production Aide III",
                "salaryGradeId": "sg-5"
              }
            ]
          },
          {
            "id": "rp-corp-75",
            "name": "Traffic Helper",
            "salaryGradeId": "sg-2"
          },
          {
            "id": "rp-corp-86",
            "name": "Janitor",
            "salaryGradeId": "sg-2"
          },
          {
            "id": "rp-corp-109",
            "name": "Receptionist",
            "salaryGradeId": "sg-2"
          },
          {
            "id": "rp-corp-116",
            "name": "Encoder",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-116-1",
                "name": "Encoder I",
                "salaryGradeId": "sg-2"
              },
              {
                "id": "tl-rp-corp-116-2",
                "name": "Encoder II",
                "salaryGradeId": "sg-3"
              },
              {
                "id": "tl-rp-corp-116-3",
                "name": "Encoder III",
                "salaryGradeId": "sg-5"
              }
            ]
          }
        ]
      },
      {
        "id": "rl-f-0",
        "code": "0",
        "positions": [
          {
            "id": "rp-corp-1",
            "name": "Marketing Associate",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-1-1",
                "name": "Marketing Associate I",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-1-2",
                "name": "Marketing Associate II",
                "salaryGradeId": "sg-2"
              },
              {
                "id": "tl-rp-corp-1-3",
                "name": "Marketing Associate III",
                "salaryGradeId": "sg-3"
              }
            ]
          },
          {
            "id": "rp-corp-4",
            "name": "Account Sales Manager",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-4-1",
                "name": "Account Sales Manager I",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-4-2",
                "name": "Account Sales Manager II",
                "salaryGradeId": "sg-2"
              },
              {
                "id": "tl-rp-corp-4-3",
                "name": "Account Sales Manager III",
                "salaryGradeId": "sg-3"
              }
            ]
          },
          {
            "id": "rp-corp-7",
            "name": "Learning Systems Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-7-1",
                "name": "Learning Systems Specialist I",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-7-2",
                "name": "Learning Systems Specialist II",
                "salaryGradeId": "sg-2"
              },
              {
                "id": "tl-rp-corp-7-3",
                "name": "Learning Systems Specialist III",
                "salaryGradeId": "sg-3"
              }
            ]
          },
          {
            "id": "rp-corp-31",
            "name": "LIS - Trainer",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-31-1",
                "name": "LIS - Trainer I",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-31-2",
                "name": "LIS - Trainer II",
                "salaryGradeId": "sg-2"
              },
              {
                "id": "tl-rp-corp-31-3",
                "name": "LIS - Trainer III",
                "salaryGradeId": "sg-3"
              }
            ]
          },
          {
            "id": "rp-corp-32",
            "name": "Learning Integration Specialist 3",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-32-1",
                "name": "Learning Integration Specialist 3 I",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-32-2",
                "name": "Learning Integration Specialist 3 II",
                "salaryGradeId": "sg-2"
              },
              {
                "id": "tl-rp-corp-32-3",
                "name": "Learning Integration Specialist 3 III",
                "salaryGradeId": "sg-3"
              }
            ]
          },
          {
            "id": "rp-corp-33",
            "name": "Learning Integration Specialist 2",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-33-1",
                "name": "Learning Integration Specialist 2 I",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-33-2",
                "name": "Learning Integration Specialist 2 II",
                "salaryGradeId": "sg-2"
              },
              {
                "id": "tl-rp-corp-33-3",
                "name": "Learning Integration Specialist 2 III",
                "salaryGradeId": "sg-3"
              }
            ]
          },
          {
            "id": "rp-corp-34",
            "name": "LIS - Cadet",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-34-1",
                "name": "LIS - Cadet I",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-34-2",
                "name": "LIS - Cadet II",
                "salaryGradeId": "sg-2"
              },
              {
                "id": "tl-rp-corp-34-3",
                "name": "LIS - Cadet III",
                "salaryGradeId": "sg-3"
              }
            ]
          },
          {
            "id": "rp-corp-35",
            "name": "Learning Integration Specialist",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-35-1",
                "name": "Learning Integration Specialist I",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-35-2",
                "name": "Learning Integration Specialist II",
                "salaryGradeId": "sg-2"
              },
              {
                "id": "tl-rp-corp-35-3",
                "name": "Learning Integration Specialist III",
                "salaryGradeId": "sg-3"
              }
            ]
          },
          {
            "id": "rp-corp-64",
            "name": "Technical Support Technician",
            "salaryGradeId": "sg-1"
          },
          {
            "id": "rp-corp-65",
            "name": "Technical Support Technician 2",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-65-1",
                "name": "Technical Support Technician 2 I",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-65-2",
                "name": "Technical Support Technician 2 II",
                "salaryGradeId": "sg-2"
              },
              {
                "id": "tl-rp-corp-65-3",
                "name": "Technical Support Technician 2 III",
                "salaryGradeId": "sg-3"
              }
            ]
          },
          {
            "id": "rp-corp-88",
            "name": "Utility Assistant",
            "salaryGradeId": "",
            "subLevels": [
              {
                "id": "tl-rp-corp-88-1",
                "name": "Utility Assistant I",
                "salaryGradeId": "sg-1"
              },
              {
                "id": "tl-rp-corp-88-2",
                "name": "Utility Assistant II",
                "salaryGradeId": "sg-2"
              },
              {
                "id": "tl-rp-corp-88-3",
                "name": "Utility Assistant III",
                "salaryGradeId": "sg-3"
              }
            ]
          },
          {
            "id": "rp-corp-89",
            "name": "Sewer",
            "salaryGradeId": "sg-1"
          },
          {
            "id": "rp-corp-91",
            "name": "Jr. Sales Processor",
            "salaryGradeId": "sg-1"
          }
        ]
      }
    ]
  }
];

export const MOCK_POSITIONS: Position[] = [
  {
    "id": "p-corp-0",
    "title": "Customer Service Specialist",
    "orgUnitId": "ou-corp-2",
    "defaultBasePay": 71600,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-0",
    "subLevelsStepId": "tl-rp-corp-0-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-0"
  },
  {
    "id": "p-corp-1",
    "title": "Marketing Associate",
    "orgUnitId": "ou-corp-5",
    "defaultBasePay": 42482,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-1",
    "subLevelsStepId": "tl-rp-corp-1-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-2",
    "title": "Marketing Associate",
    "orgUnitId": "ou-corp-4",
    "defaultBasePay": 73523,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-1",
    "subLevelsStepId": "tl-rp-corp-1-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-3",
    "title": "Customer Service Specialist",
    "orgUnitId": "ou-corp-4",
    "defaultBasePay": 34745,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-0",
    "subLevelsStepId": "tl-rp-corp-0-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-4",
    "title": "Sales Manager",
    "orgUnitId": "ou-corp-6",
    "defaultBasePay": 61958,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-2",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-5",
    "title": "CS Supervisor",
    "orgUnitId": "ou-corp-6",
    "defaultBasePay": 37659,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-3",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-4"
  },
  {
    "id": "p-corp-6",
    "title": "Account Sales Manager",
    "orgUnitId": "ou-corp-6",
    "defaultBasePay": 66494,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-4",
    "subLevelsStepId": "tl-rp-corp-4-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-4"
  },
  {
    "id": "p-corp-7",
    "title": "Sales Manager",
    "orgUnitId": "ou-corp-7",
    "defaultBasePay": 67846,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-2",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-8",
    "title": "Driver",
    "orgUnitId": "ou-corp-7",
    "defaultBasePay": 70336,
    "salaryGradeId": "sg-3",
    "rankId": "r-f",
    "rankLevelId": "rl-f-2",
    "rankPositionId": "rp-corp-5",
    "subLevelsStepId": "tl-rp-corp-5-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-7"
  },
  {
    "id": "p-corp-9",
    "title": "CS Supervisor",
    "orgUnitId": "ou-corp-7",
    "defaultBasePay": 53609,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-3",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-7"
  },
  {
    "id": "p-corp-10",
    "title": "Account Sales Manager",
    "orgUnitId": "ou-corp-7",
    "defaultBasePay": 43372,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-4",
    "subLevelsStepId": "tl-rp-corp-4-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-7"
  },
  {
    "id": "p-corp-11",
    "title": "Sales Manager",
    "orgUnitId": "ou-corp-8",
    "defaultBasePay": 55766,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-2",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-12",
    "title": "Marketing Associate",
    "orgUnitId": "ou-corp-8",
    "defaultBasePay": 68729,
    "salaryGradeId": "sg-2",
    "rankId": "r-f",
    "rankLevelId": "rl-f-1",
    "rankPositionId": "rp-corp-6",
    "subLevelsStepId": "tl-rp-corp-6-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-11"
  },
  {
    "id": "p-corp-13",
    "title": "Marketing Associate",
    "orgUnitId": "ou-corp-8",
    "defaultBasePay": 79173,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-1",
    "subLevelsStepId": "tl-rp-corp-1-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-11"
  },
  {
    "id": "p-corp-14",
    "title": "Learning Systems Specialist",
    "orgUnitId": "ou-corp-8",
    "defaultBasePay": 32348,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-7",
    "subLevelsStepId": "tl-rp-corp-7-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-11"
  },
  {
    "id": "p-corp-15",
    "title": "CS Supervisor",
    "orgUnitId": "ou-corp-8",
    "defaultBasePay": 51156,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-3",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-11"
  },
  {
    "id": "p-corp-16",
    "title": "Account Sales Manager",
    "orgUnitId": "ou-corp-8",
    "defaultBasePay": 47265,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-4",
    "subLevelsStepId": "tl-rp-corp-4-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-11"
  },
  {
    "id": "p-corp-17",
    "title": "Sales Manager",
    "orgUnitId": "ou-corp-9",
    "defaultBasePay": 49090,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-2",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-18",
    "title": "Customer Service Specialist",
    "orgUnitId": "ou-corp-10",
    "defaultBasePay": 30685,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-0",
    "subLevelsStepId": "tl-rp-corp-0-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-19",
    "title": "Marketing Associate",
    "orgUnitId": "ou-corp-11",
    "defaultBasePay": 72574,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-1",
    "subLevelsStepId": "tl-rp-corp-1-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-21"
  },
  {
    "id": "p-corp-20",
    "title": "Learning Systems Specialist",
    "orgUnitId": "ou-corp-11",
    "defaultBasePay": 67157,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-7",
    "subLevelsStepId": "tl-rp-corp-7-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-21"
  },
  {
    "id": "p-corp-21",
    "title": "Driver",
    "orgUnitId": "ou-corp-11",
    "defaultBasePay": 42518,
    "salaryGradeId": "sg-3",
    "rankId": "r-f",
    "rankLevelId": "rl-f-2",
    "rankPositionId": "rp-corp-5",
    "subLevelsStepId": "tl-rp-corp-5-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-22",
    "title": "Sales Manager",
    "orgUnitId": "ou-corp-12",
    "defaultBasePay": 47377,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-2",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-23",
    "title": "Marketing Associate",
    "orgUnitId": "ou-corp-12",
    "defaultBasePay": 48806,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-1",
    "subLevelsStepId": "tl-rp-corp-1-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-22"
  },
  {
    "id": "p-corp-24",
    "title": "Learning Systems Specialist",
    "orgUnitId": "ou-corp-12",
    "defaultBasePay": 72289,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-7",
    "subLevelsStepId": "tl-rp-corp-7-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-22"
  },
  {
    "id": "p-corp-25",
    "title": "Driver",
    "orgUnitId": "ou-corp-12",
    "defaultBasePay": 63992,
    "salaryGradeId": "sg-3",
    "rankId": "r-f",
    "rankLevelId": "rl-f-2",
    "rankPositionId": "rp-corp-5",
    "subLevelsStepId": "tl-rp-corp-5-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-22"
  },
  {
    "id": "p-corp-26",
    "title": "Sales Manager",
    "orgUnitId": "ou-corp-13",
    "defaultBasePay": 43295,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-2",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-27",
    "title": "Marketing Associate",
    "orgUnitId": "ou-corp-13",
    "defaultBasePay": 30059,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-1",
    "subLevelsStepId": "tl-rp-corp-1-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-26"
  },
  {
    "id": "p-corp-28",
    "title": "Learning Systems Specialist",
    "orgUnitId": "ou-corp-13",
    "defaultBasePay": 52989,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-7",
    "subLevelsStepId": "tl-rp-corp-7-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-26"
  },
  {
    "id": "p-corp-29",
    "title": "Driver",
    "orgUnitId": "ou-corp-13",
    "defaultBasePay": 63685,
    "salaryGradeId": "sg-3",
    "rankId": "r-f",
    "rankLevelId": "rl-f-2",
    "rankPositionId": "rp-corp-5",
    "subLevelsStepId": "tl-rp-corp-5-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-26"
  },
  {
    "id": "p-corp-30",
    "title": "Account Sales Manager",
    "orgUnitId": "ou-corp-13",
    "defaultBasePay": 51289,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-4",
    "subLevelsStepId": "tl-rp-corp-4-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-26"
  },
  {
    "id": "p-corp-31",
    "title": "Vice President",
    "orgUnitId": "ou-corp-14",
    "defaultBasePay": 31307,
    "salaryGradeId": "sg-16",
    "rankId": "r-x",
    "rankLevelId": "rl-x-7",
    "rankPositionId": "rp-corp-8",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-32",
    "title": "Marketing Associate",
    "orgUnitId": "ou-corp-14",
    "defaultBasePay": 32233,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-1",
    "subLevelsStepId": "tl-rp-corp-1-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-33",
    "title": "Customer Service Specialist",
    "orgUnitId": "ou-corp-14",
    "defaultBasePay": 74935,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-0",
    "subLevelsStepId": "tl-rp-corp-0-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-34",
    "title": "Sales Manager",
    "orgUnitId": "ou-corp-15",
    "defaultBasePay": 53135,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-2",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-35",
    "title": "Marketing Associate",
    "orgUnitId": "ou-corp-15",
    "defaultBasePay": 75595,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-1",
    "subLevelsStepId": "tl-rp-corp-1-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-34"
  },
  {
    "id": "p-corp-36",
    "title": "Learning Systems Specialist",
    "orgUnitId": "ou-corp-15",
    "defaultBasePay": 78948,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-7",
    "subLevelsStepId": "tl-rp-corp-7-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-34"
  },
  {
    "id": "p-corp-37",
    "title": "Account Sales Manager",
    "orgUnitId": "ou-corp-15",
    "defaultBasePay": 70919,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-4",
    "subLevelsStepId": "tl-rp-corp-4-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-34"
  },
  {
    "id": "p-corp-38",
    "title": "Learning Systems Specialist",
    "orgUnitId": "ou-corp-16",
    "defaultBasePay": 52711,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-7",
    "subLevelsStepId": "tl-rp-corp-7-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-39"
  },
  {
    "id": "p-corp-39",
    "title": "Customer Service Specialist",
    "orgUnitId": "ou-corp-16",
    "defaultBasePay": 50210,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-0",
    "subLevelsStepId": "tl-rp-corp-0-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-40",
    "title": "Learning Systems Specialist",
    "orgUnitId": "ou-corp-17",
    "defaultBasePay": 38956,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-7",
    "subLevelsStepId": "tl-rp-corp-7-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-41",
    "title": "Learning Systems Specialist",
    "orgUnitId": "ou-corp-18",
    "defaultBasePay": 45337,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-7",
    "subLevelsStepId": "tl-rp-corp-7-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-42",
    "title": "Marketing Associate",
    "orgUnitId": "ou-corp-19",
    "defaultBasePay": 54279,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-1",
    "subLevelsStepId": "tl-rp-corp-1-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-43",
    "title": "Sales Manager",
    "orgUnitId": "ou-corp-20",
    "defaultBasePay": 41685,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-2",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-44",
    "title": "Learning Systems Specialist",
    "orgUnitId": "ou-corp-21",
    "defaultBasePay": 70348,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-7",
    "subLevelsStepId": "tl-rp-corp-7-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-45",
    "title": "Sales Manager",
    "orgUnitId": "ou-corp-22",
    "defaultBasePay": 41540,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-2",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-46",
    "title": "Marketing Associate",
    "orgUnitId": "ou-corp-22",
    "defaultBasePay": 56994,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-1",
    "subLevelsStepId": "tl-rp-corp-1-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-45"
  },
  {
    "id": "p-corp-47",
    "title": "Learning Systems Specialist",
    "orgUnitId": "ou-corp-22",
    "defaultBasePay": 56160,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-7",
    "subLevelsStepId": "tl-rp-corp-7-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-45"
  },
  {
    "id": "p-corp-48",
    "title": "Customer Service Specialist",
    "orgUnitId": "ou-corp-22",
    "defaultBasePay": 68525,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-0",
    "subLevelsStepId": "tl-rp-corp-0-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-45"
  },
  {
    "id": "p-corp-49",
    "title": "Sales Manager",
    "orgUnitId": "ou-corp-23",
    "defaultBasePay": 57783,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-2",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-50",
    "title": "Sales Manager",
    "orgUnitId": "ou-corp-24",
    "defaultBasePay": 69481,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-2",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-51",
    "title": "Marketing Associate",
    "orgUnitId": "ou-corp-24",
    "defaultBasePay": 58356,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-1",
    "subLevelsStepId": "tl-rp-corp-1-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-50"
  },
  {
    "id": "p-corp-52",
    "title": "Learning Systems Specialist",
    "orgUnitId": "ou-corp-24",
    "defaultBasePay": 55297,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-7",
    "subLevelsStepId": "tl-rp-corp-7-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-50"
  },
  {
    "id": "p-corp-53",
    "title": "Account Sales Manager",
    "orgUnitId": "ou-corp-24",
    "defaultBasePay": 71890,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-4",
    "subLevelsStepId": "tl-rp-corp-4-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-50"
  },
  {
    "id": "p-corp-54",
    "title": "Marketing Clerk",
    "orgUnitId": "ou-corp-25",
    "defaultBasePay": 31028,
    "salaryGradeId": "sg-3",
    "rankId": "r-f",
    "rankLevelId": "rl-f-2",
    "rankPositionId": "rp-corp-9",
    "subLevelsStepId": "tl-rp-corp-9-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-55"
  },
  {
    "id": "p-corp-55",
    "title": "Area Vice President",
    "orgUnitId": "ou-corp-25",
    "defaultBasePay": 54084,
    "salaryGradeId": "sg-12",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6B",
    "rankPositionId": "rp-corp-10",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-56",
    "title": "Warehouse Helper",
    "orgUnitId": "ou-corp-26",
    "defaultBasePay": 35700,
    "salaryGradeId": "sg-2",
    "rankId": "r-f",
    "rankLevelId": "rl-f-1",
    "rankPositionId": "rp-corp-11",
    "subLevelsStepId": "tl-rp-corp-11-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-59"
  },
  {
    "id": "p-corp-57",
    "title": "Marketing Associate",
    "orgUnitId": "ou-corp-26",
    "defaultBasePay": 47641,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-1",
    "subLevelsStepId": "tl-rp-corp-1-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-59"
  },
  {
    "id": "p-corp-58",
    "title": "Learning Systems Specialist",
    "orgUnitId": "ou-corp-26",
    "defaultBasePay": 79997,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-7",
    "subLevelsStepId": "tl-rp-corp-7-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-59"
  },
  {
    "id": "p-corp-59",
    "title": "Customer Service Specialist",
    "orgUnitId": "ou-corp-26",
    "defaultBasePay": 37648,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-0",
    "subLevelsStepId": "tl-rp-corp-0-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-60",
    "title": "Account Sales Manager",
    "orgUnitId": "ou-corp-26",
    "defaultBasePay": 38688,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-4",
    "subLevelsStepId": "tl-rp-corp-4-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-59"
  },
  {
    "id": "p-corp-61",
    "title": "Marketing Associate",
    "orgUnitId": "ou-corp-27",
    "defaultBasePay": 57224,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-1",
    "subLevelsStepId": "tl-rp-corp-1-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-62",
    "title": "Vice President",
    "orgUnitId": "ou-corp-28",
    "defaultBasePay": 32887,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-12",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-63",
    "title": "Learning Systems Specialist",
    "orgUnitId": "ou-corp-28",
    "defaultBasePay": 76191,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-7",
    "subLevelsStepId": "tl-rp-corp-7-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-62"
  },
  {
    "id": "p-corp-64",
    "title": "Driver",
    "orgUnitId": "ou-corp-28",
    "defaultBasePay": 73360,
    "salaryGradeId": "sg-3",
    "rankId": "r-f",
    "rankLevelId": "rl-f-2",
    "rankPositionId": "rp-corp-5",
    "subLevelsStepId": "tl-rp-corp-5-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-62"
  },
  {
    "id": "p-corp-65",
    "title": "Customer Service Specialist",
    "orgUnitId": "ou-corp-28",
    "defaultBasePay": 59524,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-0",
    "subLevelsStepId": "tl-rp-corp-0-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-62"
  },
  {
    "id": "p-corp-66",
    "title": "Marketing Associate",
    "orgUnitId": "ou-corp-29",
    "defaultBasePay": 60533,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-1",
    "subLevelsStepId": "tl-rp-corp-1-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-68"
  },
  {
    "id": "p-corp-67",
    "title": "Learning Systems Specialist",
    "orgUnitId": "ou-corp-29",
    "defaultBasePay": 36575,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-7",
    "subLevelsStepId": "tl-rp-corp-7-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-68"
  },
  {
    "id": "p-corp-68",
    "title": "Driver",
    "orgUnitId": "ou-corp-29",
    "defaultBasePay": 66254,
    "salaryGradeId": "sg-3",
    "rankId": "r-f",
    "rankLevelId": "rl-f-2",
    "rankPositionId": "rp-corp-5",
    "subLevelsStepId": "tl-rp-corp-5-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-69",
    "title": "Marketing Associate",
    "orgUnitId": "ou-corp-30",
    "defaultBasePay": 33106,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-1",
    "subLevelsStepId": "tl-rp-corp-1-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-70",
    "title": "Learning Systems Specialist",
    "orgUnitId": "ou-corp-30",
    "defaultBasePay": 36036,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-7",
    "subLevelsStepId": "tl-rp-corp-7-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-69"
  },
  {
    "id": "p-corp-71",
    "title": "Learning Systems Specialist",
    "orgUnitId": "ou-corp-31",
    "defaultBasePay": 44774,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-7",
    "subLevelsStepId": "tl-rp-corp-7-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-72",
    "title": "Marketing Associate",
    "orgUnitId": "ou-corp-32",
    "defaultBasePay": 58939,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-1",
    "subLevelsStepId": "tl-rp-corp-1-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-31"
  },
  {
    "id": "p-corp-73",
    "title": "Multimedia Specialist (Events)",
    "orgUnitId": "ou-corp-34",
    "defaultBasePay": 40380,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-13",
    "subLevelsStepId": "tl-rp-corp-13-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-78"
  },
  {
    "id": "p-corp-74",
    "title": "Media Specialist",
    "orgUnitId": "ou-corp-34",
    "defaultBasePay": 67067,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-14",
    "subLevelsStepId": "tl-rp-corp-14-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-78"
  },
  {
    "id": "p-corp-75",
    "title": "CMC Assistant",
    "orgUnitId": "ou-corp-34",
    "defaultBasePay": 46345,
    "salaryGradeId": "sg-5",
    "rankId": "r-f",
    "rankLevelId": "rl-f-3",
    "rankPositionId": "rp-corp-15",
    "subLevelsStepId": "tl-rp-corp-15-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-78"
  },
  {
    "id": "p-corp-76",
    "title": "Online Media Specialist",
    "orgUnitId": "ou-corp-35",
    "defaultBasePay": 62449,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-16",
    "subLevelsStepId": "tl-rp-corp-16-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-78"
  },
  {
    "id": "p-corp-77",
    "title": "Events Specialist",
    "orgUnitId": "ou-corp-35",
    "defaultBasePay": 73287,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-17",
    "subLevelsStepId": "tl-rp-corp-17-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-78"
  },
  {
    "id": "p-corp-78",
    "title": "Corporate Communication Manager",
    "orgUnitId": "ou-corp-35",
    "defaultBasePay": 65380,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-18",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-78"
  },
  {
    "id": "p-corp-79",
    "title": "Product Specialist",
    "orgUnitId": "ou-corp-36",
    "defaultBasePay": 57291,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-19",
    "subLevelsStepId": "tl-rp-corp-19-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-78"
  },
  {
    "id": "p-corp-80",
    "title": "PDI Specialist",
    "orgUnitId": "ou-corp-36",
    "defaultBasePay": 52786,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-20",
    "subLevelsStepId": "tl-rp-corp-20-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-79"
  },
  {
    "id": "p-corp-81",
    "title": "Product Specialist",
    "orgUnitId": "ou-corp-38",
    "defaultBasePay": 67246,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-19",
    "subLevelsStepId": "tl-rp-corp-19-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-82"
  },
  {
    "id": "p-corp-82",
    "title": "Product Manager- Print",
    "orgUnitId": "ou-corp-38",
    "defaultBasePay": 77408,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-21",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-82"
  },
  {
    "id": "p-corp-83",
    "title": "Product Specialist - Textbook",
    "orgUnitId": "ou-corp-37",
    "defaultBasePay": 37841,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-22",
    "subLevelsStepId": "tl-rp-corp-22-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-82"
  },
  {
    "id": "p-corp-84",
    "title": "Product Manager- Digital",
    "orgUnitId": "ou-corp-39",
    "defaultBasePay": 52320,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-23",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-82"
  },
  {
    "id": "p-corp-85",
    "title": "Vice President",
    "orgUnitId": "ou-corp-41",
    "defaultBasePay": 76160,
    "salaryGradeId": "sg-16",
    "rankId": "r-x",
    "rankLevelId": "rl-x-7",
    "rankPositionId": "rp-corp-8",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-86"
  },
  {
    "id": "p-corp-86",
    "title": "President",
    "orgUnitId": "ou-corp-41",
    "defaultBasePay": 69004,
    "salaryGradeId": "sg-18",
    "rankId": "r-x",
    "rankLevelId": "rl-x-8",
    "rankPositionId": "rp-corp-24",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-86"
  },
  {
    "id": "p-corp-87",
    "title": "Executive Vice President",
    "orgUnitId": "ou-corp-41",
    "defaultBasePay": 61029,
    "salaryGradeId": "sg-18",
    "rankId": "r-x",
    "rankLevelId": "rl-x-8",
    "rankPositionId": "rp-corp-25",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-86"
  },
  {
    "id": "p-corp-88",
    "title": "Executive Director",
    "orgUnitId": "ou-corp-41",
    "defaultBasePay": 35220,
    "salaryGradeId": "sg-18",
    "rankId": "r-x",
    "rankLevelId": "rl-x-8",
    "rankPositionId": "rp-corp-26",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-86"
  },
  {
    "id": "p-corp-89",
    "title": "Executive Director",
    "orgUnitId": "ou-corp-41",
    "defaultBasePay": 78353,
    "salaryGradeId": "sg-16",
    "rankId": "r-x",
    "rankLevelId": "rl-x-7",
    "rankPositionId": "rp-corp-27",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-86"
  },
  {
    "id": "p-corp-90",
    "title": "Telesales Specialist",
    "orgUnitId": "ou-corp-44",
    "defaultBasePay": 59241,
    "salaryGradeId": "sg-2",
    "rankId": "r-f",
    "rankLevelId": "rl-f-1",
    "rankPositionId": "rp-corp-28",
    "subLevelsStepId": "tl-rp-corp-28-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-90"
  },
  {
    "id": "p-corp-91",
    "title": "Marketing Services Manager",
    "orgUnitId": "ou-corp-46",
    "defaultBasePay": 59333,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-29",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-91"
  },
  {
    "id": "p-corp-92",
    "title": "Marketing Services Assistant",
    "orgUnitId": "ou-corp-46",
    "defaultBasePay": 66431,
    "salaryGradeId": "sg-5",
    "rankId": "r-f",
    "rankLevelId": "rl-f-3",
    "rankPositionId": "rp-corp-30",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-91"
  },
  {
    "id": "p-corp-93",
    "title": "Events Specialist",
    "orgUnitId": "ou-corp-46",
    "defaultBasePay": 66920,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-17",
    "subLevelsStepId": "tl-rp-corp-17-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-91"
  },
  {
    "id": "p-corp-94",
    "title": "Product Specialist",
    "orgUnitId": "ou-corp-48",
    "defaultBasePay": 36152,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-19",
    "subLevelsStepId": "tl-rp-corp-19-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-94"
  },
  {
    "id": "p-corp-95",
    "title": "LIS - Trainer",
    "orgUnitId": "ou-corp-51",
    "defaultBasePay": 51606,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-31",
    "subLevelsStepId": "tl-rp-corp-31-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-96",
    "title": "Learning Integration Specialist 3",
    "orgUnitId": "ou-corp-51",
    "defaultBasePay": 69759,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-32",
    "subLevelsStepId": "tl-rp-corp-32-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-95"
  },
  {
    "id": "p-corp-97",
    "title": "Learning Integration Specialist 2",
    "orgUnitId": "ou-corp-51",
    "defaultBasePay": 76287,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-33",
    "subLevelsStepId": "tl-rp-corp-33-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-95"
  },
  {
    "id": "p-corp-98",
    "title": "LIS - Trainer",
    "orgUnitId": "ou-corp-52",
    "defaultBasePay": 32940,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-31",
    "subLevelsStepId": "tl-rp-corp-31-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-99",
    "title": "LIS - Cadet",
    "orgUnitId": "ou-corp-52",
    "defaultBasePay": 33982,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-34",
    "subLevelsStepId": "tl-rp-corp-34-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-98"
  },
  {
    "id": "p-corp-100",
    "title": "Learning Integration Specialist 3",
    "orgUnitId": "ou-corp-52",
    "defaultBasePay": 64047,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-32",
    "subLevelsStepId": "tl-rp-corp-32-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-98"
  },
  {
    "id": "p-corp-101",
    "title": "Learning Integration Specialist",
    "orgUnitId": "ou-corp-52",
    "defaultBasePay": 72775,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-35",
    "subLevelsStepId": "tl-rp-corp-35-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-98"
  },
  {
    "id": "p-corp-102",
    "title": "LIS - Trainer",
    "orgUnitId": "ou-corp-53",
    "defaultBasePay": 54585,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-31",
    "subLevelsStepId": "tl-rp-corp-31-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-103",
    "title": "Learning Integration Specialist 3",
    "orgUnitId": "ou-corp-53",
    "defaultBasePay": 69536,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-32",
    "subLevelsStepId": "tl-rp-corp-32-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-102"
  },
  {
    "id": "p-corp-104",
    "title": "Learning Integration Specialist 2",
    "orgUnitId": "ou-corp-53",
    "defaultBasePay": 49021,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-33",
    "subLevelsStepId": "tl-rp-corp-33-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-102"
  },
  {
    "id": "p-corp-105",
    "title": "LIS - Cadet",
    "orgUnitId": "ou-corp-54",
    "defaultBasePay": 74605,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-34",
    "subLevelsStepId": "tl-rp-corp-34-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-106",
    "title": "Curriculum and Content Manager",
    "orgUnitId": "ou-corp-55",
    "defaultBasePay": 36906,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-36",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-107",
    "title": "LIS - Trainer",
    "orgUnitId": "ou-corp-56",
    "defaultBasePay": 67128,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-31",
    "subLevelsStepId": "tl-rp-corp-31-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-108",
    "title": "LIS - Cadet",
    "orgUnitId": "ou-corp-56",
    "defaultBasePay": 39216,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-34",
    "subLevelsStepId": "tl-rp-corp-34-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-107"
  },
  {
    "id": "p-corp-109",
    "title": "Learning Integration Specialist 3",
    "orgUnitId": "ou-corp-56",
    "defaultBasePay": 39575,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-32",
    "subLevelsStepId": "tl-rp-corp-32-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-107"
  },
  {
    "id": "p-corp-110",
    "title": "Learning Integration Specialist 2",
    "orgUnitId": "ou-corp-56",
    "defaultBasePay": 39273,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-33",
    "subLevelsStepId": "tl-rp-corp-33-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-107"
  },
  {
    "id": "p-corp-111",
    "title": "LIS - Trainer",
    "orgUnitId": "ou-corp-57",
    "defaultBasePay": 37063,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-31",
    "subLevelsStepId": "tl-rp-corp-31-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-114"
  },
  {
    "id": "p-corp-112",
    "title": "LIS - Cadet",
    "orgUnitId": "ou-corp-57",
    "defaultBasePay": 40847,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-34",
    "subLevelsStepId": "tl-rp-corp-34-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-114"
  },
  {
    "id": "p-corp-113",
    "title": "Learning Integration Specialist 3",
    "orgUnitId": "ou-corp-57",
    "defaultBasePay": 73081,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-32",
    "subLevelsStepId": "tl-rp-corp-32-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-114"
  },
  {
    "id": "p-corp-114",
    "title": "E-Learning Specialist",
    "orgUnitId": "ou-corp-57",
    "defaultBasePay": 36807,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-37",
    "subLevelsStepId": "tl-rp-corp-37-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-115",
    "title": "E-Learning Specialist",
    "orgUnitId": "ou-corp-58",
    "defaultBasePay": 59757,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-37",
    "subLevelsStepId": "tl-rp-corp-37-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-116",
    "title": "LIS - Cadet",
    "orgUnitId": "ou-corp-59",
    "defaultBasePay": 33583,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-34",
    "subLevelsStepId": "tl-rp-corp-34-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-117",
    "title": "Learning Integration Specialist 3",
    "orgUnitId": "ou-corp-59",
    "defaultBasePay": 72347,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-32",
    "subLevelsStepId": "tl-rp-corp-32-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-116"
  },
  {
    "id": "p-corp-118",
    "title": "LIS - Cadet",
    "orgUnitId": "ou-corp-60",
    "defaultBasePay": 73760,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-34",
    "subLevelsStepId": "tl-rp-corp-34-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-119",
    "title": "Learning Integration Specialist 3",
    "orgUnitId": "ou-corp-60",
    "defaultBasePay": 37685,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-32",
    "subLevelsStepId": "tl-rp-corp-32-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-118"
  },
  {
    "id": "p-corp-120",
    "title": "Learning Integration Specialist 2",
    "orgUnitId": "ou-corp-60",
    "defaultBasePay": 41527,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-33",
    "subLevelsStepId": "tl-rp-corp-33-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-118"
  },
  {
    "id": "p-corp-121",
    "title": "Training Specialist",
    "orgUnitId": "ou-corp-50",
    "defaultBasePay": 42862,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-38",
    "subLevelsStepId": "tl-rp-corp-38-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-122",
    "title": "LIS - Cadet",
    "orgUnitId": "ou-corp-50",
    "defaultBasePay": 76824,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-34",
    "subLevelsStepId": "tl-rp-corp-34-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-123",
    "title": "Learning Integration Specialist",
    "orgUnitId": "ou-corp-50",
    "defaultBasePay": 35215,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-35",
    "subLevelsStepId": "tl-rp-corp-35-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-124",
    "title": "LIS - Trainer",
    "orgUnitId": "ou-corp-61",
    "defaultBasePay": 52347,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-31",
    "subLevelsStepId": "tl-rp-corp-31-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-125",
    "title": "Learning Integration Specialist 3",
    "orgUnitId": "ou-corp-61",
    "defaultBasePay": 61736,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-32",
    "subLevelsStepId": "tl-rp-corp-32-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-124"
  },
  {
    "id": "p-corp-126",
    "title": "LIS - Trainer",
    "orgUnitId": "ou-corp-62",
    "defaultBasePay": 65190,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-31",
    "subLevelsStepId": "tl-rp-corp-31-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-127",
    "title": "LIS - Cadet",
    "orgUnitId": "ou-corp-62",
    "defaultBasePay": 45893,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-34",
    "subLevelsStepId": "tl-rp-corp-34-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-126"
  },
  {
    "id": "p-corp-128",
    "title": "Learning Integration Specialist 3",
    "orgUnitId": "ou-corp-62",
    "defaultBasePay": 45358,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-32",
    "subLevelsStepId": "tl-rp-corp-32-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-126"
  },
  {
    "id": "p-corp-129",
    "title": "Learning Integration Specialist 2",
    "orgUnitId": "ou-corp-62",
    "defaultBasePay": 79714,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-33",
    "subLevelsStepId": "tl-rp-corp-33-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-126"
  },
  {
    "id": "p-corp-130",
    "title": "LIS - Cadet",
    "orgUnitId": "ou-corp-63",
    "defaultBasePay": 75274,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-34",
    "subLevelsStepId": "tl-rp-corp-34-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-131",
    "title": "Learning Integration Specialist 3",
    "orgUnitId": "ou-corp-63",
    "defaultBasePay": 73447,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-32",
    "subLevelsStepId": "tl-rp-corp-32-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-130"
  },
  {
    "id": "p-corp-132",
    "title": "Learning Integration Specialist 2",
    "orgUnitId": "ou-corp-63",
    "defaultBasePay": 57283,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-33",
    "subLevelsStepId": "tl-rp-corp-33-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-130"
  },
  {
    "id": "p-corp-133",
    "title": "LIS - Cadet",
    "orgUnitId": "ou-corp-64",
    "defaultBasePay": 78451,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-34",
    "subLevelsStepId": "tl-rp-corp-34-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-134",
    "title": "LIS - Cadet",
    "orgUnitId": "ou-corp-65",
    "defaultBasePay": 36014,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-34",
    "subLevelsStepId": "tl-rp-corp-34-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-135",
    "title": "Learning Integration Specialist 3",
    "orgUnitId": "ou-corp-65",
    "defaultBasePay": 40931,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-32",
    "subLevelsStepId": "tl-rp-corp-32-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-134"
  },
  {
    "id": "p-corp-136",
    "title": "Learning Integration Specialist 2",
    "orgUnitId": "ou-corp-65",
    "defaultBasePay": 37090,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-33",
    "subLevelsStepId": "tl-rp-corp-33-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-134"
  },
  {
    "id": "p-corp-137",
    "title": "Learning Integration Specialist 3",
    "orgUnitId": "ou-corp-66",
    "defaultBasePay": 33502,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-32",
    "subLevelsStepId": "tl-rp-corp-32-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-138",
    "title": "Learning Integration Specialist 2",
    "orgUnitId": "ou-corp-66",
    "defaultBasePay": 52440,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-33",
    "subLevelsStepId": "tl-rp-corp-33-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-137"
  },
  {
    "id": "p-corp-139",
    "title": "Learning Integration Specialist 3",
    "orgUnitId": "ou-corp-67",
    "defaultBasePay": 72877,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-32",
    "subLevelsStepId": "tl-rp-corp-32-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-140",
    "title": "LIS - Cadet",
    "orgUnitId": "ou-corp-68",
    "defaultBasePay": 52964,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-34",
    "subLevelsStepId": "tl-rp-corp-34-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-141",
    "title": "Learning Integration Specialist 2",
    "orgUnitId": "ou-corp-68",
    "defaultBasePay": 79033,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-33",
    "subLevelsStepId": "tl-rp-corp-33-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-140"
  },
  {
    "id": "p-corp-142",
    "title": "LIS Operation and Implementation Manager",
    "orgUnitId": "ou-corp-69",
    "defaultBasePay": 35072,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-39",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-143",
    "title": "E-Learning Specialist",
    "orgUnitId": "ou-corp-69",
    "defaultBasePay": 59288,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-37",
    "subLevelsStepId": "tl-rp-corp-37-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-142"
  },
  {
    "id": "p-corp-144",
    "title": "Learning Integration Specialist",
    "orgUnitId": "ou-corp-70",
    "defaultBasePay": 73202,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-35",
    "subLevelsStepId": "tl-rp-corp-35-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-145",
    "title": "Learning Integration Specialist 3",
    "orgUnitId": "ou-corp-71",
    "defaultBasePay": 60086,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-32",
    "subLevelsStepId": "tl-rp-corp-32-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-146",
    "title": "Learning Integration Specialist 2",
    "orgUnitId": "ou-corp-71",
    "defaultBasePay": 66736,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-33",
    "subLevelsStepId": "tl-rp-corp-33-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-145"
  },
  {
    "id": "p-corp-147",
    "title": "LIS - Cadet",
    "orgUnitId": "ou-corp-72",
    "defaultBasePay": 69322,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-34",
    "subLevelsStepId": "tl-rp-corp-34-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-148",
    "title": "Learning Integration Specialist 2",
    "orgUnitId": "ou-corp-72",
    "defaultBasePay": 65779,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-33",
    "subLevelsStepId": "tl-rp-corp-33-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-147"
  },
  {
    "id": "p-corp-149",
    "title": "LIS - Trainer",
    "orgUnitId": "ou-corp-73",
    "defaultBasePay": 46303,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-31",
    "subLevelsStepId": "tl-rp-corp-31-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-150"
  },
  {
    "id": "p-corp-150",
    "title": "LIS - Cadet",
    "orgUnitId": "ou-corp-73",
    "defaultBasePay": 77338,
    "salaryGradeId": "sg-2",
    "rankId": "r-f",
    "rankLevelId": "rl-f-1",
    "rankPositionId": "rp-corp-40",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-106"
  },
  {
    "id": "p-corp-151",
    "title": "LIS - Cadet",
    "orgUnitId": "ou-corp-73",
    "defaultBasePay": 60077,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-34",
    "subLevelsStepId": "tl-rp-corp-34-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-150"
  },
  {
    "id": "p-corp-152",
    "title": "Learning Integration Specialist 3",
    "orgUnitId": "ou-corp-73",
    "defaultBasePay": 69838,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-32",
    "subLevelsStepId": "tl-rp-corp-32-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-150"
  },
  {
    "id": "p-corp-153",
    "title": "PDI Specialist",
    "orgUnitId": "ou-corp-75",
    "defaultBasePay": 41061,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-20",
    "subLevelsStepId": "tl-rp-corp-20-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-153"
  },
  {
    "id": "p-corp-154",
    "title": "Senior Digitization Specialist",
    "orgUnitId": "ou-corp-78",
    "defaultBasePay": 32936,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-41",
    "subLevelsStepId": "tl-rp-corp-41-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-154"
  },
  {
    "id": "p-corp-155",
    "title": "Digitization Specialist",
    "orgUnitId": "ou-corp-78",
    "defaultBasePay": 74685,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-42",
    "subLevelsStepId": "tl-rp-corp-42-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-154"
  },
  {
    "id": "p-corp-156",
    "title": "Multimedia Content Specialist",
    "orgUnitId": "ou-corp-80",
    "defaultBasePay": 56653,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-43",
    "subLevelsStepId": "tl-rp-corp-43-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-156"
  },
  {
    "id": "p-corp-157",
    "title": "Instructional Design Specialist",
    "orgUnitId": "ou-corp-82",
    "defaultBasePay": 64067,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-44",
    "subLevelsStepId": "tl-rp-corp-44-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-160"
  },
  {
    "id": "p-corp-158",
    "title": "Sr. Development Editor",
    "orgUnitId": "ou-corp-82",
    "defaultBasePay": 43410,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-45",
    "subLevelsStepId": "tl-rp-corp-45-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-160"
  },
  {
    "id": "p-corp-159",
    "title": "Messenger",
    "orgUnitId": "ou-corp-82",
    "defaultBasePay": 47707,
    "salaryGradeId": "sg-2",
    "rankId": "r-f",
    "rankLevelId": "rl-f-1",
    "rankPositionId": "rp-corp-46",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-160"
  },
  {
    "id": "p-corp-160",
    "title": "Manuscript Evaluation Manager",
    "orgUnitId": "ou-corp-82",
    "defaultBasePay": 70517,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-47",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-160"
  },
  {
    "id": "p-corp-161",
    "title": "Junior Development Editor",
    "orgUnitId": "ou-corp-82",
    "defaultBasePay": 30082,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-48",
    "subLevelsStepId": "tl-rp-corp-48-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-160"
  },
  {
    "id": "p-corp-162",
    "title": "Development Editor",
    "orgUnitId": "ou-corp-82",
    "defaultBasePay": 73938,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-49",
    "subLevelsStepId": "tl-rp-corp-49-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-160"
  },
  {
    "id": "p-corp-163",
    "title": "Administrative Assistant",
    "orgUnitId": "ou-corp-82",
    "defaultBasePay": 53922,
    "salaryGradeId": "sg-5",
    "rankId": "r-f",
    "rankLevelId": "rl-f-3",
    "rankPositionId": "rp-corp-50",
    "subLevelsStepId": "tl-rp-corp-50-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-160"
  },
  {
    "id": "p-corp-164",
    "title": "Technical Specialist",
    "orgUnitId": "ou-corp-84",
    "defaultBasePay": 37475,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-51",
    "subLevelsStepId": "tl-rp-corp-51-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-171"
  },
  {
    "id": "p-corp-165",
    "title": "Sr. Layout Artist",
    "orgUnitId": "ou-corp-84",
    "defaultBasePay": 77237,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-52",
    "subLevelsStepId": "tl-rp-corp-52-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-171"
  },
  {
    "id": "p-corp-166",
    "title": "Production Aide",
    "orgUnitId": "ou-corp-84",
    "defaultBasePay": 56813,
    "salaryGradeId": "sg-2",
    "rankId": "r-f",
    "rankLevelId": "rl-f-1",
    "rankPositionId": "rp-corp-53",
    "subLevelsStepId": "tl-rp-corp-53-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-171"
  },
  {
    "id": "p-corp-167",
    "title": "Lay-out Artist",
    "orgUnitId": "ou-corp-84",
    "defaultBasePay": 55849,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-54",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-171"
  },
  {
    "id": "p-corp-168",
    "title": "Illustrator",
    "orgUnitId": "ou-corp-84",
    "defaultBasePay": 75488,
    "salaryGradeId": "sg-5",
    "rankId": "r-f",
    "rankLevelId": "rl-f-3",
    "rankPositionId": "rp-corp-55",
    "subLevelsStepId": "tl-rp-corp-55-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-171"
  },
  {
    "id": "p-corp-169",
    "title": "Graphic Artist",
    "orgUnitId": "ou-corp-84",
    "defaultBasePay": 46652,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-56",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-171"
  },
  {
    "id": "p-corp-170",
    "title": "Art Supervisor",
    "orgUnitId": "ou-corp-84",
    "defaultBasePay": 47473,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-57",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-171"
  },
  {
    "id": "p-corp-171",
    "title": "Art Director",
    "orgUnitId": "ou-corp-84",
    "defaultBasePay": 39416,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-58",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-171"
  },
  {
    "id": "p-corp-172",
    "title": "Lay-out Artist",
    "orgUnitId": "ou-corp-84",
    "defaultBasePay": 58584,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-54",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-171"
  },
  {
    "id": "p-corp-173",
    "title": "Book Editor",
    "orgUnitId": "ou-corp-86",
    "defaultBasePay": 56354,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-59",
    "subLevelsStepId": "tl-rp-corp-59-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-174"
  },
  {
    "id": "p-corp-174",
    "title": "Editor-In-Chief",
    "orgUnitId": "ou-corp-86",
    "defaultBasePay": 67550,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-60",
    "subLevelsStepId": "tl-rp-corp-60-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-174"
  },
  {
    "id": "p-corp-175",
    "title": "Copy Editor",
    "orgUnitId": "ou-corp-86",
    "defaultBasePay": 42561,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-61",
    "subLevelsStepId": "tl-rp-corp-61-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-174"
  },
  {
    "id": "p-corp-176",
    "title": "Book Editor",
    "orgUnitId": "ou-corp-86",
    "defaultBasePay": 79709,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-59",
    "subLevelsStepId": "tl-rp-corp-59-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-174"
  },
  {
    "id": "p-corp-177",
    "title": "Magazine Editor",
    "orgUnitId": "ou-corp-88",
    "defaultBasePay": 71961,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-62",
    "subLevelsStepId": "tl-rp-corp-62-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-178"
  },
  {
    "id": "p-corp-178",
    "title": "Editor in Chief (SEM)",
    "orgUnitId": "ou-corp-88",
    "defaultBasePay": 36986,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-63",
    "subLevelsStepId": "tl-rp-corp-63-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-178"
  },
  {
    "id": "p-corp-179",
    "title": "Copy Editor",
    "orgUnitId": "ou-corp-88",
    "defaultBasePay": 48721,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-61",
    "subLevelsStepId": "tl-rp-corp-61-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-178"
  },
  {
    "id": "p-corp-180",
    "title": "Copy Editor",
    "orgUnitId": "ou-corp-90",
    "defaultBasePay": 40750,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-61",
    "subLevelsStepId": "tl-rp-corp-61-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-180"
  },
  {
    "id": "p-corp-181",
    "title": "Book Editor",
    "orgUnitId": "ou-corp-90",
    "defaultBasePay": 63576,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-59",
    "subLevelsStepId": "tl-rp-corp-59-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-180"
  },
  {
    "id": "p-corp-182",
    "title": "Technical Support Technician",
    "orgUnitId": "ou-corp-92",
    "defaultBasePay": 52444,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-64",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-185"
  },
  {
    "id": "p-corp-183",
    "title": "Technical Support Technician 2",
    "orgUnitId": "ou-corp-93",
    "defaultBasePay": 58703,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-65",
    "subLevelsStepId": "tl-rp-corp-65-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-185"
  },
  {
    "id": "p-corp-184",
    "title": "Technical Support Technician",
    "orgUnitId": "ou-corp-93",
    "defaultBasePay": 67335,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-64",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-185"
  },
  {
    "id": "p-corp-185",
    "title": "Technical Support Supervisor",
    "orgUnitId": "ou-corp-93",
    "defaultBasePay": 57504,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-66",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-185"
  },
  {
    "id": "p-corp-186",
    "title": "Harwdware Specialist",
    "orgUnitId": "ou-corp-93",
    "defaultBasePay": 76351,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-67",
    "subLevelsStepId": "tl-rp-corp-67-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-185"
  },
  {
    "id": "p-corp-187",
    "title": "e-Learning Cabling & Hardware Assistant",
    "orgUnitId": "ou-corp-93",
    "defaultBasePay": 39507,
    "salaryGradeId": "sg-5",
    "rankId": "r-f",
    "rankLevelId": "rl-f-3",
    "rankPositionId": "rp-corp-68",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-185"
  },
  {
    "id": "p-corp-188",
    "title": "E-learning Aftersales Specialist",
    "orgUnitId": "ou-corp-93",
    "defaultBasePay": 74055,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-69",
    "subLevelsStepId": "tl-rp-corp-69-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-185"
  },
  {
    "id": "p-corp-189",
    "title": "Cabling Supervisor",
    "orgUnitId": "ou-corp-93",
    "defaultBasePay": 52616,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-70",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-185"
  },
  {
    "id": "p-corp-190",
    "title": "Cabling Assistant",
    "orgUnitId": "ou-corp-93",
    "defaultBasePay": 49544,
    "salaryGradeId": "sg-3",
    "rankId": "r-f",
    "rankLevelId": "rl-f-2",
    "rankPositionId": "rp-corp-71",
    "subLevelsStepId": "tl-rp-corp-71-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-185"
  },
  {
    "id": "p-corp-191",
    "title": "Production Manager",
    "orgUnitId": "ou-corp-95",
    "defaultBasePay": 50018,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-72",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-191"
  },
  {
    "id": "p-corp-192",
    "title": "Print Supervisor",
    "orgUnitId": "ou-corp-95",
    "defaultBasePay": 42025,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-73",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-191"
  },
  {
    "id": "p-corp-193",
    "title": "Print Specialist",
    "orgUnitId": "ou-corp-95",
    "defaultBasePay": 67518,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-74",
    "subLevelsStepId": "tl-rp-corp-74-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-191"
  },
  {
    "id": "p-corp-194",
    "title": "Traffic Helper",
    "orgUnitId": "ou-corp-97",
    "defaultBasePay": 78391,
    "salaryGradeId": "sg-2",
    "rankId": "r-f",
    "rankLevelId": "rl-f-1",
    "rankPositionId": "rp-corp-75",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-197"
  },
  {
    "id": "p-corp-195",
    "title": "Traffic Helper",
    "orgUnitId": "ou-corp-96",
    "defaultBasePay": 69315,
    "salaryGradeId": "sg-2",
    "rankId": "r-f",
    "rankLevelId": "rl-f-1",
    "rankPositionId": "rp-corp-75",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-197"
  },
  {
    "id": "p-corp-196",
    "title": "Driver",
    "orgUnitId": "ou-corp-96",
    "defaultBasePay": 37152,
    "salaryGradeId": "sg-3",
    "rankId": "r-f",
    "rankLevelId": "rl-f-2",
    "rankPositionId": "rp-corp-5",
    "subLevelsStepId": "tl-rp-corp-5-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-197"
  },
  {
    "id": "p-corp-197",
    "title": "Traffic Supervisor",
    "orgUnitId": "ou-corp-98",
    "defaultBasePay": 46780,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-76",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-197"
  },
  {
    "id": "p-corp-198",
    "title": "Traffic Helper",
    "orgUnitId": "ou-corp-98",
    "defaultBasePay": 41006,
    "salaryGradeId": "sg-2",
    "rankId": "r-f",
    "rankLevelId": "rl-f-1",
    "rankPositionId": "rp-corp-75",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-197"
  },
  {
    "id": "p-corp-199",
    "title": "Traffic Assistant",
    "orgUnitId": "ou-corp-98",
    "defaultBasePay": 35985,
    "salaryGradeId": "sg-5",
    "rankId": "r-f",
    "rankLevelId": "rl-f-3",
    "rankPositionId": "rp-corp-77",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-197"
  },
  {
    "id": "p-corp-200",
    "title": "Delivery Assistant",
    "orgUnitId": "ou-corp-98",
    "defaultBasePay": 73998,
    "salaryGradeId": "sg-5",
    "rankId": "r-f",
    "rankLevelId": "rl-f-3",
    "rankPositionId": "rp-corp-78",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-197"
  },
  {
    "id": "p-corp-201",
    "title": "Operations Support Supervisor",
    "orgUnitId": "ou-corp-100",
    "defaultBasePay": 50734,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-79",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-201"
  },
  {
    "id": "p-corp-202",
    "title": "Operations Support Assistant",
    "orgUnitId": "ou-corp-100",
    "defaultBasePay": 59545,
    "salaryGradeId": "sg-5",
    "rankId": "r-f",
    "rankLevelId": "rl-f-3",
    "rankPositionId": "rp-corp-80",
    "subLevelsStepId": "tl-rp-corp-80-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-201"
  },
  {
    "id": "p-corp-203",
    "title": "Operations Assistant",
    "orgUnitId": "ou-corp-100",
    "defaultBasePay": 60994,
    "salaryGradeId": "sg-5",
    "rankId": "r-f",
    "rankLevelId": "rl-f-3",
    "rankPositionId": "rp-corp-81",
    "subLevelsStepId": "tl-rp-corp-81-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-201"
  },
  {
    "id": "p-corp-204",
    "title": "Office and Purchasing Assistant",
    "orgUnitId": "ou-corp-100",
    "defaultBasePay": 51285,
    "salaryGradeId": "sg-5",
    "rankId": "r-f",
    "rankLevelId": "rl-f-3",
    "rankPositionId": "rp-corp-82",
    "subLevelsStepId": "tl-rp-corp-82-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-201"
  },
  {
    "id": "p-corp-205",
    "title": "Warehouse Helper",
    "orgUnitId": "ou-corp-102",
    "defaultBasePay": 42429,
    "salaryGradeId": "sg-2",
    "rankId": "r-f",
    "rankLevelId": "rl-f-1",
    "rankPositionId": "rp-corp-11",
    "subLevelsStepId": "tl-rp-corp-11-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-207"
  },
  {
    "id": "p-corp-206",
    "title": "Warehouse Helper",
    "orgUnitId": "ou-corp-101",
    "defaultBasePay": 76332,
    "salaryGradeId": "sg-2",
    "rankId": "r-f",
    "rankLevelId": "rl-f-1",
    "rankPositionId": "rp-corp-11",
    "subLevelsStepId": "tl-rp-corp-11-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-207"
  },
  {
    "id": "p-corp-207",
    "title": "Warehouse Supervisor",
    "orgUnitId": "ou-corp-103",
    "defaultBasePay": 64783,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-83",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-207"
  },
  {
    "id": "p-corp-208",
    "title": "Warehouse Helper",
    "orgUnitId": "ou-corp-103",
    "defaultBasePay": 41028,
    "salaryGradeId": "sg-2",
    "rankId": "r-f",
    "rankLevelId": "rl-f-1",
    "rankPositionId": "rp-corp-11",
    "subLevelsStepId": "tl-rp-corp-11-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-207"
  },
  {
    "id": "p-corp-209",
    "title": "Warehouse Clerk",
    "orgUnitId": "ou-corp-103",
    "defaultBasePay": 57698,
    "salaryGradeId": "sg-3",
    "rankId": "r-f",
    "rankLevelId": "rl-f-2",
    "rankPositionId": "rp-corp-84",
    "subLevelsStepId": "tl-rp-corp-84-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-207"
  },
  {
    "id": "p-corp-210",
    "title": "Warehouse Assistant",
    "orgUnitId": "ou-corp-103",
    "defaultBasePay": 36245,
    "salaryGradeId": "sg-5",
    "rankId": "r-f",
    "rankLevelId": "rl-f-3",
    "rankPositionId": "rp-corp-85",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-207"
  },
  {
    "id": "p-corp-211",
    "title": "Janitor",
    "orgUnitId": "ou-corp-103",
    "defaultBasePay": 50790,
    "salaryGradeId": "sg-2",
    "rankId": "r-f",
    "rankLevelId": "rl-f-1",
    "rankPositionId": "rp-corp-86",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-207"
  },
  {
    "id": "p-corp-212",
    "title": "Office Services Manager",
    "orgUnitId": "ou-corp-105",
    "defaultBasePay": 69804,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-87",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-212"
  },
  {
    "id": "p-corp-213",
    "title": "Utility Assistant",
    "orgUnitId": "ou-corp-107",
    "defaultBasePay": 78585,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-88",
    "subLevelsStepId": "tl-rp-corp-88-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-215"
  },
  {
    "id": "p-corp-214",
    "title": "Sewer",
    "orgUnitId": "ou-corp-107",
    "defaultBasePay": 67915,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-89",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-215"
  },
  {
    "id": "p-corp-215",
    "title": "Sales Processor",
    "orgUnitId": "ou-corp-107",
    "defaultBasePay": 59957,
    "salaryGradeId": "sg-3",
    "rankId": "r-f",
    "rankLevelId": "rl-f-2",
    "rankPositionId": "rp-corp-90",
    "subLevelsStepId": "tl-rp-corp-90-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-215"
  },
  {
    "id": "p-corp-216",
    "title": "Jr. Sales Processor",
    "orgUnitId": "ou-corp-107",
    "defaultBasePay": 32818,
    "salaryGradeId": "sg-1",
    "rankId": "r-f",
    "rankLevelId": "rl-f-0",
    "rankPositionId": "rp-corp-91",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-215"
  },
  {
    "id": "p-corp-217",
    "title": "Employee Engagement Specialist",
    "orgUnitId": "ou-corp-109",
    "defaultBasePay": 65455,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-92",
    "subLevelsStepId": "tl-rp-corp-92-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-218"
  },
  {
    "id": "p-corp-218",
    "title": "Learning and Development Specialist",
    "orgUnitId": "ou-corp-110",
    "defaultBasePay": 40422,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-93",
    "subLevelsStepId": "tl-rp-corp-93-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-218"
  },
  {
    "id": "p-corp-219",
    "title": "Technical Analyst",
    "orgUnitId": "ou-corp-111",
    "defaultBasePay": 60993,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-94",
    "subLevelsStepId": "tl-rp-corp-94-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-232"
  },
  {
    "id": "p-corp-220",
    "title": "Systems Administrator",
    "orgUnitId": "ou-corp-111",
    "defaultBasePay": 48301,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-95",
    "subLevelsStepId": "tl-rp-corp-95-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-232"
  },
  {
    "id": "p-corp-221",
    "title": "Quality Assurance Analyst",
    "orgUnitId": "ou-corp-111",
    "defaultBasePay": 56228,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-96",
    "subLevelsStepId": "tl-rp-corp-96-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-232"
  },
  {
    "id": "p-corp-222",
    "title": "Junior Programmer",
    "orgUnitId": "ou-corp-111",
    "defaultBasePay": 38173,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-97",
    "subLevelsStepId": "tl-rp-corp-97-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-232"
  },
  {
    "id": "p-corp-223",
    "title": "Junior Developer",
    "orgUnitId": "ou-corp-111",
    "defaultBasePay": 59637,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-98",
    "subLevelsStepId": "tl-rp-corp-98-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-232"
  },
  {
    "id": "p-corp-224",
    "title": "IT Systems Support",
    "orgUnitId": "ou-corp-111",
    "defaultBasePay": 78317,
    "salaryGradeId": "sg-5",
    "rankId": "r-f",
    "rankLevelId": "rl-f-3",
    "rankPositionId": "rp-corp-99",
    "subLevelsStepId": "tl-rp-corp-99-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-232"
  },
  {
    "id": "p-corp-225",
    "title": "Technical Support Technician",
    "orgUnitId": "ou-corp-112",
    "defaultBasePay": 55061,
    "salaryGradeId": "sg-5",
    "rankId": "r-f",
    "rankLevelId": "rl-f-3",
    "rankPositionId": "rp-corp-100",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-232"
  },
  {
    "id": "p-corp-226",
    "title": "Technical Analyst",
    "orgUnitId": "ou-corp-112",
    "defaultBasePay": 61189,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-94",
    "subLevelsStepId": "tl-rp-corp-94-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-232"
  },
  {
    "id": "p-corp-227",
    "title": "Senior Developer",
    "orgUnitId": "ou-corp-112",
    "defaultBasePay": 66242,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-101",
    "subLevelsStepId": "tl-rp-corp-101-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-232"
  },
  {
    "id": "p-corp-228",
    "title": "Quality Assurance Analyst",
    "orgUnitId": "ou-corp-112",
    "defaultBasePay": 35023,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-96",
    "subLevelsStepId": "tl-rp-corp-96-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-232"
  },
  {
    "id": "p-corp-229",
    "title": "Network Administrator",
    "orgUnitId": "ou-corp-112",
    "defaultBasePay": 43697,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-102",
    "subLevelsStepId": "tl-rp-corp-102-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-232"
  },
  {
    "id": "p-corp-230",
    "title": "Junior Programmer",
    "orgUnitId": "ou-corp-112",
    "defaultBasePay": 43030,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-97",
    "subLevelsStepId": "tl-rp-corp-97-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-232"
  },
  {
    "id": "p-corp-231",
    "title": "Junior Developer",
    "orgUnitId": "ou-corp-112",
    "defaultBasePay": 71573,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-98",
    "subLevelsStepId": "tl-rp-corp-98-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-232"
  },
  {
    "id": "p-corp-232",
    "title": "IT Manager",
    "orgUnitId": "ou-corp-112",
    "defaultBasePay": 33885,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-103",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-232"
  },
  {
    "id": "p-corp-233",
    "title": "Data Center Supervisor",
    "orgUnitId": "ou-corp-112",
    "defaultBasePay": 57725,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-104",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-232"
  },
  {
    "id": "p-corp-234",
    "title": "Customer Service Specialist",
    "orgUnitId": "ou-corp-114",
    "defaultBasePay": 58784,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-0",
    "subLevelsStepId": "tl-rp-corp-0-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-234"
  },
  {
    "id": "p-corp-235",
    "title": "HR Specialist",
    "orgUnitId": "ou-corp-115",
    "defaultBasePay": 60226,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-105",
    "subLevelsStepId": "tl-rp-corp-105-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-264"
  },
  {
    "id": "p-corp-236",
    "title": "HRMD Supervisor",
    "orgUnitId": "ou-corp-116",
    "defaultBasePay": 56817,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-106",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-264"
  },
  {
    "id": "p-corp-237",
    "title": "HR Specialist",
    "orgUnitId": "ou-corp-116",
    "defaultBasePay": 51019,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-107",
    "subLevelsStepId": "tl-rp-corp-107-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-236"
  },
  {
    "id": "p-corp-238",
    "title": "HR Specialist",
    "orgUnitId": "ou-corp-116",
    "defaultBasePay": 51922,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-105",
    "subLevelsStepId": "tl-rp-corp-105-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-236"
  },
  {
    "id": "p-corp-239",
    "title": "Field Auditor",
    "orgUnitId": "ou-corp-118",
    "defaultBasePay": 46286,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-108",
    "subLevelsStepId": "tl-rp-corp-108-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-239"
  },
  {
    "id": "p-corp-240",
    "title": "Receptionist",
    "orgUnitId": "ou-corp-120",
    "defaultBasePay": 60022,
    "salaryGradeId": "sg-2",
    "rankId": "r-f",
    "rankLevelId": "rl-f-1",
    "rankPositionId": "rp-corp-109",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-241"
  },
  {
    "id": "p-corp-241",
    "title": "Office Services Specialist",
    "orgUnitId": "ou-corp-121",
    "defaultBasePay": 39174,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-110",
    "subLevelsStepId": "tl-rp-corp-110-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-241"
  },
  {
    "id": "p-corp-242",
    "title": "Messenger",
    "orgUnitId": "ou-corp-121",
    "defaultBasePay": 73249,
    "salaryGradeId": "sg-2",
    "rankId": "r-f",
    "rankLevelId": "rl-f-1",
    "rankPositionId": "rp-corp-46",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-241"
  },
  {
    "id": "p-corp-243",
    "title": "Maintenance Crew",
    "orgUnitId": "ou-corp-121",
    "defaultBasePay": 49983,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-111",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-241"
  },
  {
    "id": "p-corp-244",
    "title": "Maintenance Crew",
    "orgUnitId": "ou-corp-121",
    "defaultBasePay": 64126,
    "salaryGradeId": "sg-3",
    "rankId": "r-f",
    "rankLevelId": "rl-f-2",
    "rankPositionId": "rp-corp-112",
    "subLevelsStepId": "tl-rp-corp-112-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-241"
  },
  {
    "id": "p-corp-245",
    "title": "Janitor",
    "orgUnitId": "ou-corp-121",
    "defaultBasePay": 62723,
    "salaryGradeId": "sg-2",
    "rankId": "r-f",
    "rankLevelId": "rl-f-1",
    "rankPositionId": "rp-corp-86",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-241"
  },
  {
    "id": "p-corp-246",
    "title": "AR Specialist",
    "orgUnitId": "ou-corp-122",
    "defaultBasePay": 36445,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-113",
    "subLevelsStepId": "tl-rp-corp-113-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-258"
  },
  {
    "id": "p-corp-247",
    "title": "AP Specialist",
    "orgUnitId": "ou-corp-122",
    "defaultBasePay": 65832,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-114",
    "subLevelsStepId": "tl-rp-corp-114-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-258"
  },
  {
    "id": "p-corp-248",
    "title": "Accounting Assistant",
    "orgUnitId": "ou-corp-122",
    "defaultBasePay": 40754,
    "salaryGradeId": "sg-5",
    "rankId": "r-f",
    "rankLevelId": "rl-f-3",
    "rankPositionId": "rp-corp-115",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-258"
  },
  {
    "id": "p-corp-249",
    "title": "Encoder",
    "orgUnitId": "ou-corp-123",
    "defaultBasePay": 67664,
    "salaryGradeId": "sg-2",
    "rankId": "r-f",
    "rankLevelId": "rl-f-1",
    "rankPositionId": "rp-corp-116",
    "subLevelsStepId": "tl-rp-corp-116-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-258"
  },
  {
    "id": "p-corp-250",
    "title": "Database Mgmt / Admin Supervisor",
    "orgUnitId": "ou-corp-123",
    "defaultBasePay": 58775,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-117",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-258"
  },
  {
    "id": "p-corp-251",
    "title": "Data Analyst",
    "orgUnitId": "ou-corp-123",
    "defaultBasePay": 35317,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-118",
    "subLevelsStepId": "tl-rp-corp-118-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-258"
  },
  {
    "id": "p-corp-252",
    "title": "Cashier / Cash Management",
    "orgUnitId": "ou-corp-123",
    "defaultBasePay": 69123,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4A",
    "rankPositionId": "rp-corp-119",
    "subLevelsStepId": "tl-rp-corp-119-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-258"
  },
  {
    "id": "p-corp-253",
    "title": "AR Specialist",
    "orgUnitId": "ou-corp-123",
    "defaultBasePay": 42688,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-113",
    "subLevelsStepId": "tl-rp-corp-113-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-258"
  },
  {
    "id": "p-corp-254",
    "title": "AR & Gen Accounting Supervisor",
    "orgUnitId": "ou-corp-123",
    "defaultBasePay": 49386,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-120",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-258"
  },
  {
    "id": "p-corp-255",
    "title": "AR & Compliance Supervisor",
    "orgUnitId": "ou-corp-123",
    "defaultBasePay": 40892,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-121",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-258"
  },
  {
    "id": "p-corp-256",
    "title": "AP Specialist",
    "orgUnitId": "ou-corp-123",
    "defaultBasePay": 51774,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-114",
    "subLevelsStepId": "tl-rp-corp-114-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-258"
  },
  {
    "id": "p-corp-257",
    "title": "AP & Compliance Supervisor",
    "orgUnitId": "ou-corp-123",
    "defaultBasePay": 72607,
    "salaryGradeId": "sg-10",
    "rankId": "r-sup",
    "rankLevelId": "rl-sup-5",
    "rankPositionId": "rp-corp-122",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-258"
  },
  {
    "id": "p-corp-258",
    "title": "Accounting Manager",
    "orgUnitId": "ou-corp-123",
    "defaultBasePay": 67724,
    "salaryGradeId": "sg-14",
    "rankId": "r-m",
    "rankLevelId": "rl-m-6A",
    "rankPositionId": "rp-corp-123",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-258"
  },
  {
    "id": "p-corp-259",
    "title": "Encoder",
    "orgUnitId": "ou-corp-124",
    "defaultBasePay": 37051,
    "salaryGradeId": "sg-2",
    "rankId": "r-f",
    "rankLevelId": "rl-f-1",
    "rankPositionId": "rp-corp-116",
    "subLevelsStepId": "tl-rp-corp-116-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-260"
  },
  {
    "id": "p-corp-260",
    "title": "Accounting Specialist",
    "orgUnitId": "ou-corp-124",
    "defaultBasePay": 57357,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-124",
    "subLevelsStepId": "tl-rp-corp-124-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-258"
  },
  {
    "id": "p-corp-261",
    "title": "Executive Assistant",
    "orgUnitId": "ou-corp-125",
    "defaultBasePay": 56270,
    "salaryGradeId": "sg-6",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-125",
    "subLevelsStepId": "tl-rp-corp-125-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-263"
  },
  {
    "id": "p-corp-262",
    "title": "Driver",
    "orgUnitId": "ou-corp-125",
    "defaultBasePay": 45101,
    "salaryGradeId": "sg-3",
    "rankId": "r-f",
    "rankLevelId": "rl-f-2",
    "rankPositionId": "rp-corp-5",
    "subLevelsStepId": "tl-rp-corp-5-1",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-261"
  },
  {
    "id": "p-corp-263",
    "title": "VP of Information Technology",
    "orgUnitId": "ou-corp-108",
    "defaultBasePay": 200000,
    "salaryGradeId": "sg-16",
    "rankId": "r-x",
    "rankLevelId": "rl-x-7",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-86"
  },
  {
    "id": "p-corp-264",
    "title": "CHRO",
    "orgUnitId": "ou-corp-115",
    "defaultBasePay": 250000,
    "salaryGradeId": "sg-16",
    "rankId": "r-x",
    "rankLevelId": "rl-x-7",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-263"
  },
  {
    "id": "p-corp-265",
    "title": "VP of HRMD",
    "orgUnitId": "ou-corp-115",
    "defaultBasePay": 180000,
    "salaryGradeId": "sg-15",
    "rankId": "r-x",
    "rankLevelId": "rl-x-7",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-264"
  },
  {
    "id": "p-corp-223-2",
    "title": "Junior Developer",
    "orgUnitId": "ou-corp-111",
    "defaultBasePay": 65000,
    "salaryGradeId": "sg-7",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-98",
    "subLevelsStepId": "tl-rp-corp-98-2",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-232"
  },
  {
    "id": "p-corp-223-3",
    "title": "Junior Developer",
    "orgUnitId": "ou-corp-111",
    "defaultBasePay": 72000,
    "salaryGradeId": "sg-8",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-98",
    "subLevelsStepId": "tl-rp-corp-98-3",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-232"
  },
  {
    "id": "p-corp-223-4",
    "title": "Junior Developer",
    "orgUnitId": "ou-corp-111",
    "defaultBasePay": 80000,
    "salaryGradeId": "sg-9",
    "rankId": "r-f",
    "rankLevelId": "rl-f-4B",
    "rankPositionId": "rp-corp-98",
    "subLevelsStepId": "tl-rp-corp-98-4",
    "employmentStatus": "Regular",
    "supervisorId": "p-corp-232"
  }
];

export const MOCK_EMPLOYEES: any[] = [
  {
    "id": "emp-c-1",
    "name": "Louis Panganiban",
    "role": "Customer Service Specialist",
    "department": "Sales",
    "avatar": "LP",
    "email": "louis.panganiban@nexuscorp.com",
    "positionId": "p-corp-0",
    "orgUnitId": "ou-corp-2"
  },
  {
    "id": "emp-c-2",
    "name": "Juan Panganiban",
    "role": "Marketing Associate",
    "department": "Sales",
    "avatar": "JP",
    "email": "juan.panganiban@nexuscorp.com",
    "positionId": "p-corp-1",
    "orgUnitId": "ou-corp-5"
  },
  {
    "id": "emp-c-3",
    "name": "Maria Panganiban",
    "role": "Marketing Associate",
    "department": "Sales",
    "avatar": "MP",
    "email": "maria.panganiban@nexuscorp.com",
    "positionId": "p-corp-2",
    "orgUnitId": "ou-corp-4"
  },
  {
    "id": "emp-c-4",
    "name": "Jose Panganiban",
    "role": "Customer Service Specialist",
    "department": "Sales",
    "avatar": "JP",
    "email": "jose.panganiban@nexuscorp.com",
    "positionId": "p-corp-3",
    "orgUnitId": "ou-corp-4"
  },
  {
    "id": "emp-c-5",
    "name": "Andres Panganiban",
    "role": "Sales Manager",
    "department": "Sales",
    "avatar": "AP",
    "email": "andres.panganiban@nexuscorp.com",
    "positionId": "p-corp-4",
    "orgUnitId": "ou-corp-6"
  },
  {
    "id": "emp-c-6",
    "name": "Antonio Panganiban",
    "role": "CS Supervisor",
    "department": "Sales",
    "avatar": "AP",
    "email": "antonio.panganiban@nexuscorp.com",
    "positionId": "p-corp-5",
    "orgUnitId": "ou-corp-6"
  },
  {
    "id": "emp-c-7",
    "name": "Apolinario Panganiban",
    "role": "Account Sales Manager",
    "department": "Sales",
    "avatar": "AP",
    "email": "apolinario.panganiban@nexuscorp.com",
    "positionId": "p-corp-6",
    "orgUnitId": "ou-corp-6"
  },
  {
    "id": "emp-c-8",
    "name": "Cory Panganiban",
    "role": "Sales Manager",
    "department": "Sales",
    "avatar": "CP",
    "email": "cory.panganiban@nexuscorp.com",
    "positionId": "p-corp-7",
    "orgUnitId": "ou-corp-7"
  },
  {
    "id": "emp-c-9",
    "name": "Ferdinand Panganiban",
    "role": "Driver",
    "department": "Sales",
    "avatar": "FP",
    "email": "ferdinand.panganiban@nexuscorp.com",
    "positionId": "p-corp-8",
    "orgUnitId": "ou-corp-7"
  },
  {
    "id": "emp-c-10",
    "name": "Rodrigo Panganiban",
    "role": "CS Supervisor",
    "department": "Sales",
    "avatar": "RP",
    "email": "rodrigo.panganiban@nexuscorp.com",
    "positionId": "p-corp-9",
    "orgUnitId": "ou-corp-7"
  },
  {
    "id": "emp-c-11",
    "name": "Leni Panganiban",
    "role": "Account Sales Manager",
    "department": "Sales",
    "avatar": "LP",
    "email": "leni.panganiban@nexuscorp.com",
    "positionId": "p-corp-10",
    "orgUnitId": "ou-corp-7"
  },
  {
    "id": "emp-c-12",
    "name": "Grace Panganiban",
    "role": "Sales Manager",
    "department": "Sales",
    "avatar": "GP",
    "email": "grace.panganiban@nexuscorp.com",
    "positionId": "p-corp-11",
    "orgUnitId": "ou-corp-8"
  },
  {
    "id": "emp-c-13",
    "name": "Jejomar Panganiban",
    "role": "Marketing Associate",
    "department": "Sales",
    "avatar": "JP",
    "email": "jejomar.panganiban@nexuscorp.com",
    "positionId": "p-corp-12",
    "orgUnitId": "ou-corp-8"
  },
  {
    "id": "emp-c-14",
    "name": "Mar Panganiban",
    "role": "Marketing Associate",
    "department": "Sales",
    "avatar": "MP",
    "email": "mar.panganiban@nexuscorp.com",
    "positionId": "p-corp-13",
    "orgUnitId": "ou-corp-8"
  },
  {
    "id": "emp-c-15",
    "name": "Richard Panganiban",
    "role": "Learning Systems Specialist",
    "department": "Sales",
    "avatar": "RP",
    "email": "richard.panganiban@nexuscorp.com",
    "positionId": "p-corp-14",
    "orgUnitId": "ou-corp-8"
  },
  {
    "id": "emp-c-16",
    "name": "Ping Panganiban",
    "role": "CS Supervisor",
    "department": "Sales",
    "avatar": "PP",
    "email": "ping.panganiban@nexuscorp.com",
    "positionId": "p-corp-15",
    "orgUnitId": "ou-corp-8"
  },
  {
    "id": "emp-c-17",
    "name": "Henry Panganiban",
    "role": "Account Sales Manager",
    "department": "Sales",
    "avatar": "HP",
    "email": "henry.panganiban@nexuscorp.com",
    "positionId": "p-corp-16",
    "orgUnitId": "ou-corp-8"
  },
  {
    "id": "emp-c-18",
    "name": "Lucio Panganiban",
    "role": "Sales Manager",
    "department": "Sales",
    "avatar": "LP",
    "email": "lucio.panganiban@nexuscorp.com",
    "positionId": "p-corp-17",
    "orgUnitId": "ou-corp-9"
  },
  {
    "id": "emp-c-19",
    "name": "Tony Panganiban",
    "role": "Customer Service Specialist",
    "department": "Sales",
    "avatar": "TP",
    "email": "tony.panganiban@nexuscorp.com",
    "positionId": "p-corp-18",
    "orgUnitId": "ou-corp-10"
  },
  {
    "id": "emp-c-20",
    "name": "Lance Panganiban",
    "role": "Marketing Associate",
    "department": "Sales",
    "avatar": "LP",
    "email": "lance.panganiban@nexuscorp.com",
    "positionId": "p-corp-19",
    "orgUnitId": "ou-corp-11"
  },
  {
    "id": "emp-c-21",
    "name": "Louis Dela Cruz",
    "role": "Learning Systems Specialist",
    "department": "Sales",
    "avatar": "LD",
    "email": "louis.dela cruz@nexuscorp.com",
    "positionId": "p-corp-20",
    "orgUnitId": "ou-corp-11"
  },
  {
    "id": "emp-c-22",
    "name": "Juan Dela Cruz",
    "role": "Driver",
    "department": "Sales",
    "avatar": "JD",
    "email": "juan.dela cruz@nexuscorp.com",
    "positionId": "p-corp-21",
    "orgUnitId": "ou-corp-11"
  },
  {
    "id": "emp-c-23",
    "name": "Maria Dela Cruz",
    "role": "Sales Manager",
    "department": "Sales",
    "avatar": "MD",
    "email": "maria.dela cruz@nexuscorp.com",
    "positionId": "p-corp-22",
    "orgUnitId": "ou-corp-12"
  },
  {
    "id": "emp-c-24",
    "name": "Jose Dela Cruz",
    "role": "Marketing Associate",
    "department": "Sales",
    "avatar": "JD",
    "email": "jose.dela cruz@nexuscorp.com",
    "positionId": "p-corp-23",
    "orgUnitId": "ou-corp-12"
  },
  {
    "id": "emp-c-25",
    "name": "Andres Dela Cruz",
    "role": "Learning Systems Specialist",
    "department": "Sales",
    "avatar": "AD",
    "email": "andres.dela cruz@nexuscorp.com",
    "positionId": "p-corp-24",
    "orgUnitId": "ou-corp-12"
  },
  {
    "id": "emp-c-26",
    "name": "Antonio Dela Cruz",
    "role": "Driver",
    "department": "Sales",
    "avatar": "AD",
    "email": "antonio.dela cruz@nexuscorp.com",
    "positionId": "p-corp-25",
    "orgUnitId": "ou-corp-12"
  },
  {
    "id": "emp-c-27",
    "name": "Apolinario Dela Cruz",
    "role": "Sales Manager",
    "department": "Sales",
    "avatar": "AD",
    "email": "apolinario.dela cruz@nexuscorp.com",
    "positionId": "p-corp-26",
    "orgUnitId": "ou-corp-13"
  },
  {
    "id": "emp-c-28",
    "name": "Cory Dela Cruz",
    "role": "Marketing Associate",
    "department": "Sales",
    "avatar": "CD",
    "email": "cory.dela cruz@nexuscorp.com",
    "positionId": "p-corp-27",
    "orgUnitId": "ou-corp-13"
  },
  {
    "id": "emp-c-29",
    "name": "Ferdinand Dela Cruz",
    "role": "Learning Systems Specialist",
    "department": "Sales",
    "avatar": "FD",
    "email": "ferdinand.dela cruz@nexuscorp.com",
    "positionId": "p-corp-28",
    "orgUnitId": "ou-corp-13"
  },
  {
    "id": "emp-c-30",
    "name": "Rodrigo Dela Cruz",
    "role": "Driver",
    "department": "Sales",
    "avatar": "RD",
    "email": "rodrigo.dela cruz@nexuscorp.com",
    "positionId": "p-corp-29",
    "orgUnitId": "ou-corp-13"
  },
  {
    "id": "emp-c-31",
    "name": "Leni Dela Cruz",
    "role": "Account Sales Manager",
    "department": "Sales",
    "avatar": "LD",
    "email": "leni.dela cruz@nexuscorp.com",
    "positionId": "p-corp-30",
    "orgUnitId": "ou-corp-13"
  },
  {
    "id": "emp-c-32",
    "name": "Grace Dela Cruz",
    "role": "Vice President",
    "department": "Sales",
    "avatar": "GD",
    "email": "grace.dela cruz@nexuscorp.com",
    "positionId": "p-corp-31",
    "orgUnitId": "ou-corp-14"
  },
  {
    "id": "emp-c-33",
    "name": "Jejomar Dela Cruz",
    "role": "Marketing Associate",
    "department": "Sales",
    "avatar": "JD",
    "email": "jejomar.dela cruz@nexuscorp.com",
    "positionId": "p-corp-32",
    "orgUnitId": "ou-corp-14"
  },
  {
    "id": "emp-c-34",
    "name": "Mar Dela Cruz",
    "role": "Customer Service Specialist",
    "department": "Sales",
    "avatar": "MD",
    "email": "mar.dela cruz@nexuscorp.com",
    "positionId": "p-corp-33",
    "orgUnitId": "ou-corp-14"
  },
  {
    "id": "emp-c-35",
    "name": "Richard Dela Cruz",
    "role": "Sales Manager",
    "department": "Sales",
    "avatar": "RD",
    "email": "richard.dela cruz@nexuscorp.com",
    "positionId": "p-corp-34",
    "orgUnitId": "ou-corp-15"
  },
  {
    "id": "emp-c-36",
    "name": "Ping Dela Cruz",
    "role": "Marketing Associate",
    "department": "Sales",
    "avatar": "PD",
    "email": "ping.dela cruz@nexuscorp.com",
    "positionId": "p-corp-35",
    "orgUnitId": "ou-corp-15"
  },
  {
    "id": "emp-c-37",
    "name": "Henry Dela Cruz",
    "role": "Learning Systems Specialist",
    "department": "Sales",
    "avatar": "HD",
    "email": "henry.dela cruz@nexuscorp.com",
    "positionId": "p-corp-36",
    "orgUnitId": "ou-corp-15"
  },
  {
    "id": "emp-c-38",
    "name": "Lucio Dela Cruz",
    "role": "Account Sales Manager",
    "department": "Sales",
    "avatar": "LD",
    "email": "lucio.dela cruz@nexuscorp.com",
    "positionId": "p-corp-37",
    "orgUnitId": "ou-corp-15"
  },
  {
    "id": "emp-c-39",
    "name": "Tony Dela Cruz",
    "role": "Learning Systems Specialist",
    "department": "Sales",
    "avatar": "TD",
    "email": "tony.dela cruz@nexuscorp.com",
    "positionId": "p-corp-38",
    "orgUnitId": "ou-corp-16"
  },
  {
    "id": "emp-c-40",
    "name": "Lance Dela Cruz",
    "role": "Customer Service Specialist",
    "department": "Sales",
    "avatar": "LD",
    "email": "lance.dela cruz@nexuscorp.com",
    "positionId": "p-corp-39",
    "orgUnitId": "ou-corp-16"
  },
  {
    "id": "emp-c-41",
    "name": "Louis Clara",
    "role": "Learning Systems Specialist",
    "department": "Sales",
    "avatar": "LC",
    "email": "louis.clara@nexuscorp.com",
    "positionId": "p-corp-40",
    "orgUnitId": "ou-corp-17"
  },
  {
    "id": "emp-c-42",
    "name": "Juan Clara",
    "role": "Learning Systems Specialist",
    "department": "Sales",
    "avatar": "JC",
    "email": "juan.clara@nexuscorp.com",
    "positionId": "p-corp-41",
    "orgUnitId": "ou-corp-18"
  },
  {
    "id": "emp-c-43",
    "name": "Maria Clara",
    "role": "Marketing Associate",
    "department": "Sales",
    "avatar": "MC",
    "email": "maria.clara@nexuscorp.com",
    "positionId": "p-corp-42",
    "orgUnitId": "ou-corp-19"
  },
  {
    "id": "emp-c-44",
    "name": "Jose Clara",
    "role": "Sales Manager",
    "department": "Sales",
    "avatar": "JC",
    "email": "jose.clara@nexuscorp.com",
    "positionId": "p-corp-43",
    "orgUnitId": "ou-corp-20"
  },
  {
    "id": "emp-c-45",
    "name": "Andres Clara",
    "role": "Learning Systems Specialist",
    "department": "Sales",
    "avatar": "AC",
    "email": "andres.clara@nexuscorp.com",
    "positionId": "p-corp-44",
    "orgUnitId": "ou-corp-21"
  },
  {
    "id": "emp-c-46",
    "name": "Antonio Clara",
    "role": "Sales Manager",
    "department": "Sales",
    "avatar": "AC",
    "email": "antonio.clara@nexuscorp.com",
    "positionId": "p-corp-45",
    "orgUnitId": "ou-corp-22"
  },
  {
    "id": "emp-c-47",
    "name": "Apolinario Clara",
    "role": "Marketing Associate",
    "department": "Sales",
    "avatar": "AC",
    "email": "apolinario.clara@nexuscorp.com",
    "positionId": "p-corp-46",
    "orgUnitId": "ou-corp-22"
  },
  {
    "id": "emp-c-48",
    "name": "Cory Clara",
    "role": "Learning Systems Specialist",
    "department": "Sales",
    "avatar": "CC",
    "email": "cory.clara@nexuscorp.com",
    "positionId": "p-corp-47",
    "orgUnitId": "ou-corp-22"
  },
  {
    "id": "emp-c-49",
    "name": "Ferdinand Clara",
    "role": "Customer Service Specialist",
    "department": "Sales",
    "avatar": "FC",
    "email": "ferdinand.clara@nexuscorp.com",
    "positionId": "p-corp-48",
    "orgUnitId": "ou-corp-22"
  },
  {
    "id": "emp-c-50",
    "name": "Rodrigo Clara",
    "role": "Sales Manager",
    "department": "Sales",
    "avatar": "RC",
    "email": "rodrigo.clara@nexuscorp.com",
    "positionId": "p-corp-49",
    "orgUnitId": "ou-corp-23"
  },
  {
    "id": "emp-c-51",
    "name": "Leni Clara",
    "role": "Sales Manager",
    "department": "Sales",
    "avatar": "LC",
    "email": "leni.clara@nexuscorp.com",
    "positionId": "p-corp-50",
    "orgUnitId": "ou-corp-24"
  },
  {
    "id": "emp-c-52",
    "name": "Grace Clara",
    "role": "Marketing Associate",
    "department": "Sales",
    "avatar": "GC",
    "email": "grace.clara@nexuscorp.com",
    "positionId": "p-corp-51",
    "orgUnitId": "ou-corp-24"
  },
  {
    "id": "emp-c-53",
    "name": "Jejomar Clara",
    "role": "Learning Systems Specialist",
    "department": "Sales",
    "avatar": "JC",
    "email": "jejomar.clara@nexuscorp.com",
    "positionId": "p-corp-52",
    "orgUnitId": "ou-corp-24"
  },
  {
    "id": "emp-c-54",
    "name": "Mar Clara",
    "role": "Account Sales Manager",
    "department": "Sales",
    "avatar": "MC",
    "email": "mar.clara@nexuscorp.com",
    "positionId": "p-corp-53",
    "orgUnitId": "ou-corp-24"
  },
  {
    "id": "emp-c-55",
    "name": "Richard Clara",
    "role": "Marketing Clerk",
    "department": "Sales",
    "avatar": "RC",
    "email": "richard.clara@nexuscorp.com",
    "positionId": "p-corp-54",
    "orgUnitId": "ou-corp-25"
  },
  {
    "id": "emp-c-56",
    "name": "Ping Clara",
    "role": "Area Vice President",
    "department": "Sales",
    "avatar": "PC",
    "email": "ping.clara@nexuscorp.com",
    "positionId": "p-corp-55",
    "orgUnitId": "ou-corp-25"
  },
  {
    "id": "emp-c-57",
    "name": "Henry Clara",
    "role": "Warehouse Helper",
    "department": "Sales",
    "avatar": "HC",
    "email": "henry.clara@nexuscorp.com",
    "positionId": "p-corp-56",
    "orgUnitId": "ou-corp-26"
  },
  {
    "id": "emp-c-58",
    "name": "Lucio Clara",
    "role": "Marketing Associate",
    "department": "Sales",
    "avatar": "LC",
    "email": "lucio.clara@nexuscorp.com",
    "positionId": "p-corp-57",
    "orgUnitId": "ou-corp-26"
  },
  {
    "id": "emp-c-59",
    "name": "Tony Clara",
    "role": "Learning Systems Specialist",
    "department": "Sales",
    "avatar": "TC",
    "email": "tony.clara@nexuscorp.com",
    "positionId": "p-corp-58",
    "orgUnitId": "ou-corp-26"
  },
  {
    "id": "emp-c-60",
    "name": "Lance Clara",
    "role": "Customer Service Specialist",
    "department": "Sales",
    "avatar": "LC",
    "email": "lance.clara@nexuscorp.com",
    "positionId": "p-corp-59",
    "orgUnitId": "ou-corp-26"
  },
  {
    "id": "emp-c-61",
    "name": "Louis Rizal",
    "role": "Account Sales Manager",
    "department": "Sales",
    "avatar": "LR",
    "email": "louis.rizal@nexuscorp.com",
    "positionId": "p-corp-60",
    "orgUnitId": "ou-corp-26"
  },
  {
    "id": "emp-c-62",
    "name": "Juan Rizal",
    "role": "Marketing Associate",
    "department": "Sales",
    "avatar": "JR",
    "email": "juan.rizal@nexuscorp.com",
    "positionId": "p-corp-61",
    "orgUnitId": "ou-corp-27"
  },
  {
    "id": "emp-c-63",
    "name": "Maria Rizal",
    "role": "Vice President",
    "department": "Sales",
    "avatar": "MR",
    "email": "maria.rizal@nexuscorp.com",
    "positionId": "p-corp-62",
    "orgUnitId": "ou-corp-28"
  },
  {
    "id": "emp-c-64",
    "name": "Jose Rizal",
    "role": "Learning Systems Specialist",
    "department": "Sales",
    "avatar": "JR",
    "email": "jose.rizal@nexuscorp.com",
    "positionId": "p-corp-63",
    "orgUnitId": "ou-corp-28"
  },
  {
    "id": "emp-c-65",
    "name": "Andres Rizal",
    "role": "Driver",
    "department": "Sales",
    "avatar": "AR",
    "email": "andres.rizal@nexuscorp.com",
    "positionId": "p-corp-64",
    "orgUnitId": "ou-corp-28"
  },
  {
    "id": "emp-c-66",
    "name": "Antonio Rizal",
    "role": "Customer Service Specialist",
    "department": "Sales",
    "avatar": "AR",
    "email": "antonio.rizal@nexuscorp.com",
    "positionId": "p-corp-65",
    "orgUnitId": "ou-corp-28"
  },
  {
    "id": "emp-c-67",
    "name": "Apolinario Rizal",
    "role": "Marketing Associate",
    "department": "Sales",
    "avatar": "AR",
    "email": "apolinario.rizal@nexuscorp.com",
    "positionId": "p-corp-66",
    "orgUnitId": "ou-corp-29"
  },
  {
    "id": "emp-c-68",
    "name": "Cory Rizal",
    "role": "Learning Systems Specialist",
    "department": "Sales",
    "avatar": "CR",
    "email": "cory.rizal@nexuscorp.com",
    "positionId": "p-corp-67",
    "orgUnitId": "ou-corp-29"
  },
  {
    "id": "emp-c-69",
    "name": "Ferdinand Rizal",
    "role": "Driver",
    "department": "Sales",
    "avatar": "FR",
    "email": "ferdinand.rizal@nexuscorp.com",
    "positionId": "p-corp-68",
    "orgUnitId": "ou-corp-29"
  },
  {
    "id": "emp-c-70",
    "name": "Rodrigo Rizal",
    "role": "Marketing Associate",
    "department": "Sales",
    "avatar": "RR",
    "email": "rodrigo.rizal@nexuscorp.com",
    "positionId": "p-corp-69",
    "orgUnitId": "ou-corp-30"
  },
  {
    "id": "emp-c-71",
    "name": "Leni Rizal",
    "role": "Learning Systems Specialist",
    "department": "Sales",
    "avatar": "LR",
    "email": "leni.rizal@nexuscorp.com",
    "positionId": "p-corp-70",
    "orgUnitId": "ou-corp-30"
  },
  {
    "id": "emp-c-72",
    "name": "Grace Rizal",
    "role": "Learning Systems Specialist",
    "department": "Sales",
    "avatar": "GR",
    "email": "grace.rizal@nexuscorp.com",
    "positionId": "p-corp-71",
    "orgUnitId": "ou-corp-31"
  },
  {
    "id": "emp-c-73",
    "name": "Jejomar Rizal",
    "role": "Marketing Associate",
    "department": "Sales",
    "avatar": "JR",
    "email": "jejomar.rizal@nexuscorp.com",
    "positionId": "p-corp-72",
    "orgUnitId": "ou-corp-32"
  },
  {
    "id": "emp-c-74",
    "name": "Mar Rizal",
    "role": "Multimedia Specialist (Events)",
    "department": "Corporate Communication",
    "avatar": "MR",
    "email": "mar.rizal@nexuscorp.com",
    "positionId": "p-corp-73",
    "orgUnitId": "ou-corp-34"
  },
  {
    "id": "emp-c-75",
    "name": "Richard Rizal",
    "role": "Media Specialist",
    "department": "Corporate Communication",
    "avatar": "RR",
    "email": "richard.rizal@nexuscorp.com",
    "positionId": "p-corp-74",
    "orgUnitId": "ou-corp-34"
  },
  {
    "id": "emp-c-76",
    "name": "Ping Rizal",
    "role": "CMC Assistant",
    "department": "Corporate Communication",
    "avatar": "PR",
    "email": "ping.rizal@nexuscorp.com",
    "positionId": "p-corp-75",
    "orgUnitId": "ou-corp-34"
  },
  {
    "id": "emp-c-77",
    "name": "Henry Rizal",
    "role": "Online Media Specialist",
    "department": "Corporate Communication",
    "avatar": "HR",
    "email": "henry.rizal@nexuscorp.com",
    "positionId": "p-corp-76",
    "orgUnitId": "ou-corp-35"
  },
  {
    "id": "emp-c-78",
    "name": "Lucio Rizal",
    "role": "Events Specialist",
    "department": "Corporate Communication",
    "avatar": "LR",
    "email": "lucio.rizal@nexuscorp.com",
    "positionId": "p-corp-77",
    "orgUnitId": "ou-corp-35"
  },
  {
    "id": "emp-c-79",
    "name": "Tony Rizal",
    "role": "Corporate Communication Manager",
    "department": "Corporate Communication",
    "avatar": "TR",
    "email": "tony.rizal@nexuscorp.com",
    "positionId": "p-corp-78",
    "orgUnitId": "ou-corp-35"
  },
  {
    "id": "emp-c-80",
    "name": "Lance Rizal",
    "role": "Product Specialist",
    "department": "Product Development and Innovation",
    "avatar": "LR",
    "email": "lance.rizal@nexuscorp.com",
    "positionId": "p-corp-79",
    "orgUnitId": "ou-corp-36"
  },
  {
    "id": "emp-c-81",
    "name": "Louis Bonifacio",
    "role": "PDI Specialist",
    "department": "Product Development and Innovation",
    "avatar": "LB",
    "email": "louis.bonifacio@nexuscorp.com",
    "positionId": "p-corp-80",
    "orgUnitId": "ou-corp-36"
  },
  {
    "id": "emp-c-82",
    "name": "Juan Bonifacio",
    "role": "Product Specialist",
    "department": "Product Management Group",
    "avatar": "JB",
    "email": "juan.bonifacio@nexuscorp.com",
    "positionId": "p-corp-81",
    "orgUnitId": "ou-corp-38"
  },
  {
    "id": "emp-c-83",
    "name": "Maria Bonifacio",
    "role": "Product Manager- Print",
    "department": "Product Management Group",
    "avatar": "MB",
    "email": "maria.bonifacio@nexuscorp.com",
    "positionId": "p-corp-82",
    "orgUnitId": "ou-corp-38"
  },
  {
    "id": "emp-c-84",
    "name": "Jose Bonifacio",
    "role": "Product Specialist - Textbook",
    "department": "Product Management Group",
    "avatar": "JB",
    "email": "jose.bonifacio@nexuscorp.com",
    "positionId": "p-corp-83",
    "orgUnitId": "ou-corp-37"
  },
  {
    "id": "emp-c-85",
    "name": "Andres Bonifacio",
    "role": "Product Manager- Digital",
    "department": "Product Management Group",
    "avatar": "AB",
    "email": "andres.bonifacio@nexuscorp.com",
    "positionId": "p-corp-84",
    "orgUnitId": "ou-corp-39"
  },
  {
    "id": "emp-c-86",
    "name": "Antonio Bonifacio",
    "role": "Vice President",
    "department": "Office of the President",
    "avatar": "AB",
    "email": "antonio.bonifacio@nexuscorp.com",
    "positionId": "p-corp-85",
    "orgUnitId": "ou-corp-41"
  },
  {
    "id": "emp-c-87",
    "name": "Apolinario Bonifacio",
    "role": "President",
    "department": "Office of the President",
    "avatar": "AB",
    "email": "apolinario.bonifacio@nexuscorp.com",
    "positionId": "p-corp-86",
    "orgUnitId": "ou-corp-41"
  },
  {
    "id": "emp-c-88",
    "name": "Cory Bonifacio",
    "role": "Executive Vice President",
    "department": "Office of the President",
    "avatar": "CB",
    "email": "cory.bonifacio@nexuscorp.com",
    "positionId": "p-corp-87",
    "orgUnitId": "ou-corp-41"
  },
  {
    "id": "emp-c-89",
    "name": "Ferdinand Bonifacio",
    "role": "Executive Director",
    "department": "Office of the President",
    "avatar": "FB",
    "email": "ferdinand.bonifacio@nexuscorp.com",
    "positionId": "p-corp-88",
    "orgUnitId": "ou-corp-41"
  },
  {
    "id": "emp-c-90",
    "name": "Rodrigo Bonifacio",
    "role": "Executive Director",
    "department": "Office of the President",
    "avatar": "RB",
    "email": "rodrigo.bonifacio@nexuscorp.com",
    "positionId": "p-corp-89",
    "orgUnitId": "ou-corp-41"
  },
  {
    "id": "emp-c-91",
    "name": "Leni Bonifacio",
    "role": "Telesales Specialist",
    "department": "Telesales",
    "avatar": "LB",
    "email": "leni.bonifacio@nexuscorp.com",
    "positionId": "p-corp-90",
    "orgUnitId": "ou-corp-44"
  },
  {
    "id": "emp-c-92",
    "name": "Grace Bonifacio",
    "role": "Marketing Services Manager",
    "department": "Marketing Services",
    "avatar": "GB",
    "email": "grace.bonifacio@nexuscorp.com",
    "positionId": "p-corp-91",
    "orgUnitId": "ou-corp-46"
  },
  {
    "id": "emp-c-93",
    "name": "Jejomar Bonifacio",
    "role": "Marketing Services Assistant",
    "department": "Marketing Services",
    "avatar": "JB",
    "email": "jejomar.bonifacio@nexuscorp.com",
    "positionId": "p-corp-92",
    "orgUnitId": "ou-corp-46"
  },
  {
    "id": "emp-c-94",
    "name": "Mar Bonifacio",
    "role": "Events Specialist",
    "department": "Marketing Services",
    "avatar": "MB",
    "email": "mar.bonifacio@nexuscorp.com",
    "positionId": "p-corp-93",
    "orgUnitId": "ou-corp-46"
  },
  {
    "id": "emp-c-95",
    "name": "Richard Bonifacio",
    "role": "Product Specialist",
    "department": "Product Management Group",
    "avatar": "RB",
    "email": "richard.bonifacio@nexuscorp.com",
    "positionId": "p-corp-94",
    "orgUnitId": "ou-corp-48"
  },
  {
    "id": "emp-c-96",
    "name": "Ping Bonifacio",
    "role": "LIS - Trainer",
    "department": "e-Learning Training Dept.",
    "avatar": "PB",
    "email": "ping.bonifacio@nexuscorp.com",
    "positionId": "p-corp-95",
    "orgUnitId": "ou-corp-51"
  },
  {
    "id": "emp-c-97",
    "name": "Henry Bonifacio",
    "role": "Learning Integration Specialist 3",
    "department": "e-Learning Training Dept.",
    "avatar": "HB",
    "email": "henry.bonifacio@nexuscorp.com",
    "positionId": "p-corp-96",
    "orgUnitId": "ou-corp-51"
  },
  {
    "id": "emp-c-98",
    "name": "Lucio Bonifacio",
    "role": "Learning Integration Specialist 2",
    "department": "e-Learning Training Dept.",
    "avatar": "LB",
    "email": "lucio.bonifacio@nexuscorp.com",
    "positionId": "p-corp-97",
    "orgUnitId": "ou-corp-51"
  },
  {
    "id": "emp-c-99",
    "name": "Tony Bonifacio",
    "role": "LIS - Trainer",
    "department": "e-Learning Training Dept.",
    "avatar": "TB",
    "email": "tony.bonifacio@nexuscorp.com",
    "positionId": "p-corp-98",
    "orgUnitId": "ou-corp-52"
  },
  {
    "id": "emp-c-100",
    "name": "Lance Bonifacio",
    "role": "LIS - Cadet",
    "department": "e-Learning Training Dept.",
    "avatar": "LB",
    "email": "lance.bonifacio@nexuscorp.com",
    "positionId": "p-corp-99",
    "orgUnitId": "ou-corp-52"
  },
  {
    "id": "emp-c-101",
    "name": "Louis Luna",
    "role": "Learning Integration Specialist 3",
    "department": "e-Learning Training Dept.",
    "avatar": "LL",
    "email": "louis.luna@nexuscorp.com",
    "positionId": "p-corp-100",
    "orgUnitId": "ou-corp-52"
  },
  {
    "id": "emp-c-102",
    "name": "Juan Luna",
    "role": "Learning Integration Specialist",
    "department": "e-Learning Training Dept.",
    "avatar": "JL",
    "email": "juan.luna@nexuscorp.com",
    "positionId": "p-corp-101",
    "orgUnitId": "ou-corp-52"
  },
  {
    "id": "emp-c-103",
    "name": "Maria Luna",
    "role": "LIS - Trainer",
    "department": "e-Learning Training Dept.",
    "avatar": "ML",
    "email": "maria.luna@nexuscorp.com",
    "positionId": "p-corp-102",
    "orgUnitId": "ou-corp-53"
  },
  {
    "id": "emp-c-104",
    "name": "Jose Luna",
    "role": "Learning Integration Specialist 3",
    "department": "e-Learning Training Dept.",
    "avatar": "JL",
    "email": "jose.luna@nexuscorp.com",
    "positionId": "p-corp-103",
    "orgUnitId": "ou-corp-53"
  },
  {
    "id": "emp-c-105",
    "name": "Andres Luna",
    "role": "Learning Integration Specialist 2",
    "department": "e-Learning Training Dept.",
    "avatar": "AL",
    "email": "andres.luna@nexuscorp.com",
    "positionId": "p-corp-104",
    "orgUnitId": "ou-corp-53"
  },
  {
    "id": "emp-c-106",
    "name": "Antonio Luna",
    "role": "LIS - Cadet",
    "department": "e-Learning Training Dept.",
    "avatar": "AL",
    "email": "antonio.luna@nexuscorp.com",
    "positionId": "p-corp-105",
    "orgUnitId": "ou-corp-54"
  },
  {
    "id": "emp-c-107",
    "name": "Apolinario Luna",
    "role": "Curriculum and Content Manager",
    "department": "e-Learning Training Dept.",
    "avatar": "AL",
    "email": "apolinario.luna@nexuscorp.com",
    "positionId": "p-corp-106",
    "orgUnitId": "ou-corp-55"
  },
  {
    "id": "emp-c-108",
    "name": "Cory Luna",
    "role": "LIS - Trainer",
    "department": "e-Learning Training Dept.",
    "avatar": "CL",
    "email": "cory.luna@nexuscorp.com",
    "positionId": "p-corp-107",
    "orgUnitId": "ou-corp-56"
  },
  {
    "id": "emp-c-109",
    "name": "Ferdinand Luna",
    "role": "LIS - Cadet",
    "department": "e-Learning Training Dept.",
    "avatar": "FL",
    "email": "ferdinand.luna@nexuscorp.com",
    "positionId": "p-corp-108",
    "orgUnitId": "ou-corp-56"
  },
  {
    "id": "emp-c-110",
    "name": "Rodrigo Luna",
    "role": "Learning Integration Specialist 3",
    "department": "e-Learning Training Dept.",
    "avatar": "RL",
    "email": "rodrigo.luna@nexuscorp.com",
    "positionId": "p-corp-109",
    "orgUnitId": "ou-corp-56"
  },
  {
    "id": "emp-c-111",
    "name": "Leni Luna",
    "role": "Learning Integration Specialist 2",
    "department": "e-Learning Training Dept.",
    "avatar": "LL",
    "email": "leni.luna@nexuscorp.com",
    "positionId": "p-corp-110",
    "orgUnitId": "ou-corp-56"
  },
  {
    "id": "emp-c-112",
    "name": "Grace Luna",
    "role": "LIS - Trainer",
    "department": "e-Learning Training Dept.",
    "avatar": "GL",
    "email": "grace.luna@nexuscorp.com",
    "positionId": "p-corp-111",
    "orgUnitId": "ou-corp-57"
  },
  {
    "id": "emp-c-113",
    "name": "Jejomar Luna",
    "role": "LIS - Cadet",
    "department": "e-Learning Training Dept.",
    "avatar": "JL",
    "email": "jejomar.luna@nexuscorp.com",
    "positionId": "p-corp-112",
    "orgUnitId": "ou-corp-57"
  },
  {
    "id": "emp-c-114",
    "name": "Mar Luna",
    "role": "Learning Integration Specialist 3",
    "department": "e-Learning Training Dept.",
    "avatar": "ML",
    "email": "mar.luna@nexuscorp.com",
    "positionId": "p-corp-113",
    "orgUnitId": "ou-corp-57"
  },
  {
    "id": "emp-c-115",
    "name": "Richard Luna",
    "role": "E-Learning Specialist",
    "department": "e-Learning Training Dept.",
    "avatar": "RL",
    "email": "richard.luna@nexuscorp.com",
    "positionId": "p-corp-114",
    "orgUnitId": "ou-corp-57"
  },
  {
    "id": "emp-c-116",
    "name": "Ping Luna",
    "role": "E-Learning Specialist",
    "department": "e-Learning Training Dept.",
    "avatar": "PL",
    "email": "ping.luna@nexuscorp.com",
    "positionId": "p-corp-115",
    "orgUnitId": "ou-corp-58"
  },
  {
    "id": "emp-c-117",
    "name": "Henry Luna",
    "role": "LIS - Cadet",
    "department": "e-Learning Training Dept.",
    "avatar": "HL",
    "email": "henry.luna@nexuscorp.com",
    "positionId": "p-corp-116",
    "orgUnitId": "ou-corp-59"
  },
  {
    "id": "emp-c-118",
    "name": "Lucio Luna",
    "role": "Learning Integration Specialist 3",
    "department": "e-Learning Training Dept.",
    "avatar": "LL",
    "email": "lucio.luna@nexuscorp.com",
    "positionId": "p-corp-117",
    "orgUnitId": "ou-corp-59"
  },
  {
    "id": "emp-c-119",
    "name": "Tony Luna",
    "role": "LIS - Cadet",
    "department": "e-Learning Training Dept.",
    "avatar": "TL",
    "email": "tony.luna@nexuscorp.com",
    "positionId": "p-corp-118",
    "orgUnitId": "ou-corp-60"
  },
  {
    "id": "emp-c-120",
    "name": "Lance Luna",
    "role": "Learning Integration Specialist 3",
    "department": "e-Learning Training Dept.",
    "avatar": "LL",
    "email": "lance.luna@nexuscorp.com",
    "positionId": "p-corp-119",
    "orgUnitId": "ou-corp-60"
  },
  {
    "id": "emp-c-121",
    "name": "Louis Mabini",
    "role": "Learning Integration Specialist 2",
    "department": "e-Learning Training Dept.",
    "avatar": "LM",
    "email": "louis.mabini@nexuscorp.com",
    "positionId": "p-corp-120",
    "orgUnitId": "ou-corp-60"
  },
  {
    "id": "emp-c-122",
    "name": "Juan Mabini",
    "role": "Training Specialist",
    "department": "e-Learning Training Dept.",
    "avatar": "JM",
    "email": "juan.mabini@nexuscorp.com",
    "positionId": "p-corp-121",
    "orgUnitId": "ou-corp-50"
  },
  {
    "id": "emp-c-123",
    "name": "Maria Mabini",
    "role": "LIS - Cadet",
    "department": "e-Learning Training Dept.",
    "avatar": "MM",
    "email": "maria.mabini@nexuscorp.com",
    "positionId": "p-corp-122",
    "orgUnitId": "ou-corp-50"
  },
  {
    "id": "emp-c-124",
    "name": "Jose Mabini",
    "role": "Learning Integration Specialist",
    "department": "e-Learning Training Dept.",
    "avatar": "JM",
    "email": "jose.mabini@nexuscorp.com",
    "positionId": "p-corp-123",
    "orgUnitId": "ou-corp-50"
  },
  {
    "id": "emp-c-125",
    "name": "Andres Mabini",
    "role": "LIS - Trainer",
    "department": "e-Learning Training Dept.",
    "avatar": "AM",
    "email": "andres.mabini@nexuscorp.com",
    "positionId": "p-corp-124",
    "orgUnitId": "ou-corp-61"
  },
  {
    "id": "emp-c-126",
    "name": "Antonio Mabini",
    "role": "Learning Integration Specialist 3",
    "department": "e-Learning Training Dept.",
    "avatar": "AM",
    "email": "antonio.mabini@nexuscorp.com",
    "positionId": "p-corp-125",
    "orgUnitId": "ou-corp-61"
  },
  {
    "id": "emp-c-127",
    "name": "Apolinario Mabini",
    "role": "LIS - Trainer",
    "department": "e-Learning Training Dept.",
    "avatar": "AM",
    "email": "apolinario.mabini@nexuscorp.com",
    "positionId": "p-corp-126",
    "orgUnitId": "ou-corp-62"
  },
  {
    "id": "emp-c-128",
    "name": "Cory Mabini",
    "role": "LIS - Cadet",
    "department": "e-Learning Training Dept.",
    "avatar": "CM",
    "email": "cory.mabini@nexuscorp.com",
    "positionId": "p-corp-127",
    "orgUnitId": "ou-corp-62"
  },
  {
    "id": "emp-c-129",
    "name": "Ferdinand Mabini",
    "role": "Learning Integration Specialist 3",
    "department": "e-Learning Training Dept.",
    "avatar": "FM",
    "email": "ferdinand.mabini@nexuscorp.com",
    "positionId": "p-corp-128",
    "orgUnitId": "ou-corp-62"
  },
  {
    "id": "emp-c-130",
    "name": "Rodrigo Mabini",
    "role": "Learning Integration Specialist 2",
    "department": "e-Learning Training Dept.",
    "avatar": "RM",
    "email": "rodrigo.mabini@nexuscorp.com",
    "positionId": "p-corp-129",
    "orgUnitId": "ou-corp-62"
  },
  {
    "id": "emp-c-131",
    "name": "Leni Mabini",
    "role": "LIS - Cadet",
    "department": "e-Learning Training Dept.",
    "avatar": "LM",
    "email": "leni.mabini@nexuscorp.com",
    "positionId": "p-corp-130",
    "orgUnitId": "ou-corp-63"
  },
  {
    "id": "emp-c-132",
    "name": "Grace Mabini",
    "role": "Learning Integration Specialist 3",
    "department": "e-Learning Training Dept.",
    "avatar": "GM",
    "email": "grace.mabini@nexuscorp.com",
    "positionId": "p-corp-131",
    "orgUnitId": "ou-corp-63"
  },
  {
    "id": "emp-c-133",
    "name": "Jejomar Mabini",
    "role": "Learning Integration Specialist 2",
    "department": "e-Learning Training Dept.",
    "avatar": "JM",
    "email": "jejomar.mabini@nexuscorp.com",
    "positionId": "p-corp-132",
    "orgUnitId": "ou-corp-63"
  },
  {
    "id": "emp-c-134",
    "name": "Mar Mabini",
    "role": "LIS - Cadet",
    "department": "e-Learning Training Dept.",
    "avatar": "MM",
    "email": "mar.mabini@nexuscorp.com",
    "positionId": "p-corp-133",
    "orgUnitId": "ou-corp-64"
  },
  {
    "id": "emp-c-135",
    "name": "Richard Mabini",
    "role": "LIS - Cadet",
    "department": "e-Learning Training Dept.",
    "avatar": "RM",
    "email": "richard.mabini@nexuscorp.com",
    "positionId": "p-corp-134",
    "orgUnitId": "ou-corp-65"
  },
  {
    "id": "emp-c-136",
    "name": "Ping Mabini",
    "role": "Learning Integration Specialist 3",
    "department": "e-Learning Training Dept.",
    "avatar": "PM",
    "email": "ping.mabini@nexuscorp.com",
    "positionId": "p-corp-135",
    "orgUnitId": "ou-corp-65"
  },
  {
    "id": "emp-c-137",
    "name": "Henry Mabini",
    "role": "Learning Integration Specialist 2",
    "department": "e-Learning Training Dept.",
    "avatar": "HM",
    "email": "henry.mabini@nexuscorp.com",
    "positionId": "p-corp-136",
    "orgUnitId": "ou-corp-65"
  },
  {
    "id": "emp-c-138",
    "name": "Lucio Mabini",
    "role": "Learning Integration Specialist 3",
    "department": "e-Learning Training Dept.",
    "avatar": "LM",
    "email": "lucio.mabini@nexuscorp.com",
    "positionId": "p-corp-137",
    "orgUnitId": "ou-corp-66"
  },
  {
    "id": "emp-c-139",
    "name": "Tony Mabini",
    "role": "Learning Integration Specialist 2",
    "department": "e-Learning Training Dept.",
    "avatar": "TM",
    "email": "tony.mabini@nexuscorp.com",
    "positionId": "p-corp-138",
    "orgUnitId": "ou-corp-66"
  },
  {
    "id": "emp-c-140",
    "name": "Lance Mabini",
    "role": "Learning Integration Specialist 3",
    "department": "e-Learning Training Dept.",
    "avatar": "LM",
    "email": "lance.mabini@nexuscorp.com",
    "positionId": "p-corp-139",
    "orgUnitId": "ou-corp-67"
  },
  {
    "id": "emp-c-141",
    "name": "Louis Aquino",
    "role": "LIS - Cadet",
    "department": "e-Learning Training Dept.",
    "avatar": "LA",
    "email": "louis.aquino@nexuscorp.com",
    "positionId": "p-corp-140",
    "orgUnitId": "ou-corp-68"
  },
  {
    "id": "emp-c-142",
    "name": "Juan Aquino",
    "role": "Learning Integration Specialist 2",
    "department": "e-Learning Training Dept.",
    "avatar": "JA",
    "email": "juan.aquino@nexuscorp.com",
    "positionId": "p-corp-141",
    "orgUnitId": "ou-corp-68"
  },
  {
    "id": "emp-c-143",
    "name": "Maria Aquino",
    "role": "LIS Operation and Implementation Manager",
    "department": "e-Learning Training Dept.",
    "avatar": "MA",
    "email": "maria.aquino@nexuscorp.com",
    "positionId": "p-corp-142",
    "orgUnitId": "ou-corp-69"
  },
  {
    "id": "emp-c-144",
    "name": "Jose Aquino",
    "role": "E-Learning Specialist",
    "department": "e-Learning Training Dept.",
    "avatar": "JA",
    "email": "jose.aquino@nexuscorp.com",
    "positionId": "p-corp-143",
    "orgUnitId": "ou-corp-69"
  },
  {
    "id": "emp-c-145",
    "name": "Andres Aquino",
    "role": "Learning Integration Specialist",
    "department": "e-Learning Training Dept.",
    "avatar": "AA",
    "email": "andres.aquino@nexuscorp.com",
    "positionId": "p-corp-144",
    "orgUnitId": "ou-corp-70"
  },
  {
    "id": "emp-c-146",
    "name": "Antonio Aquino",
    "role": "Learning Integration Specialist 3",
    "department": "e-Learning Training Dept.",
    "avatar": "AA",
    "email": "antonio.aquino@nexuscorp.com",
    "positionId": "p-corp-145",
    "orgUnitId": "ou-corp-71"
  },
  {
    "id": "emp-c-147",
    "name": "Apolinario Aquino",
    "role": "Learning Integration Specialist 2",
    "department": "e-Learning Training Dept.",
    "avatar": "AA",
    "email": "apolinario.aquino@nexuscorp.com",
    "positionId": "p-corp-146",
    "orgUnitId": "ou-corp-71"
  },
  {
    "id": "emp-c-148",
    "name": "Cory Aquino",
    "role": "LIS - Cadet",
    "department": "e-Learning Training Dept.",
    "avatar": "CA",
    "email": "cory.aquino@nexuscorp.com",
    "positionId": "p-corp-147",
    "orgUnitId": "ou-corp-72"
  },
  {
    "id": "emp-c-149",
    "name": "Ferdinand Aquino",
    "role": "Learning Integration Specialist 2",
    "department": "e-Learning Training Dept.",
    "avatar": "FA",
    "email": "ferdinand.aquino@nexuscorp.com",
    "positionId": "p-corp-148",
    "orgUnitId": "ou-corp-72"
  },
  {
    "id": "emp-c-150",
    "name": "Rodrigo Aquino",
    "role": "LIS - Trainer",
    "department": "e-Learning Training Dept.",
    "avatar": "RA",
    "email": "rodrigo.aquino@nexuscorp.com",
    "positionId": "p-corp-149",
    "orgUnitId": "ou-corp-73"
  },
  {
    "id": "emp-c-151",
    "name": "Leni Aquino",
    "role": "LIS - Cadet",
    "department": "e-Learning Training Dept.",
    "avatar": "LA",
    "email": "leni.aquino@nexuscorp.com",
    "positionId": "p-corp-150",
    "orgUnitId": "ou-corp-73"
  },
  {
    "id": "emp-c-152",
    "name": "Grace Aquino",
    "role": "LIS - Cadet",
    "department": "e-Learning Training Dept.",
    "avatar": "GA",
    "email": "grace.aquino@nexuscorp.com",
    "positionId": "p-corp-151",
    "orgUnitId": "ou-corp-73"
  },
  {
    "id": "emp-c-153",
    "name": "Jejomar Aquino",
    "role": "Learning Integration Specialist 3",
    "department": "e-Learning Training Dept.",
    "avatar": "JA",
    "email": "jejomar.aquino@nexuscorp.com",
    "positionId": "p-corp-152",
    "orgUnitId": "ou-corp-73"
  },
  {
    "id": "emp-c-154",
    "name": "Mar Aquino",
    "role": "PDI Specialist",
    "department": "Product Management Group",
    "avatar": "MA",
    "email": "mar.aquino@nexuscorp.com",
    "positionId": "p-corp-153",
    "orgUnitId": "ou-corp-75"
  },
  {
    "id": "emp-c-155",
    "name": "Richard Aquino",
    "role": "Senior Digitization Specialist",
    "department": "Digitization",
    "avatar": "RA",
    "email": "richard.aquino@nexuscorp.com",
    "positionId": "p-corp-154",
    "orgUnitId": "ou-corp-78"
  },
  {
    "id": "emp-c-156",
    "name": "Ping Aquino",
    "role": "Digitization Specialist",
    "department": "Digitization",
    "avatar": "PA",
    "email": "ping.aquino@nexuscorp.com",
    "positionId": "p-corp-155",
    "orgUnitId": "ou-corp-78"
  },
  {
    "id": "emp-c-157",
    "name": "Henry Aquino",
    "role": "Multimedia Content Specialist",
    "department": "Multimedia Content Unit",
    "avatar": "HA",
    "email": "henry.aquino@nexuscorp.com",
    "positionId": "p-corp-156",
    "orgUnitId": "ou-corp-80"
  },
  {
    "id": "emp-c-158",
    "name": "Lucio Aquino",
    "role": "Instructional Design Specialist",
    "department": "Managing Unit",
    "avatar": "LA",
    "email": "lucio.aquino@nexuscorp.com",
    "positionId": "p-corp-157",
    "orgUnitId": "ou-corp-82"
  },
  {
    "id": "emp-c-159",
    "name": "Tony Aquino",
    "role": "Sr. Development Editor",
    "department": "Managing Unit",
    "avatar": "TA",
    "email": "tony.aquino@nexuscorp.com",
    "positionId": "p-corp-158",
    "orgUnitId": "ou-corp-82"
  },
  {
    "id": "emp-c-160",
    "name": "Lance Aquino",
    "role": "Messenger",
    "department": "Managing Unit",
    "avatar": "LA",
    "email": "lance.aquino@nexuscorp.com",
    "positionId": "p-corp-159",
    "orgUnitId": "ou-corp-82"
  },
  {
    "id": "emp-c-161",
    "name": "Louis Marcos",
    "role": "Manuscript Evaluation Manager",
    "department": "Managing Unit",
    "avatar": "LM",
    "email": "louis.marcos@nexuscorp.com",
    "positionId": "p-corp-160",
    "orgUnitId": "ou-corp-82"
  },
  {
    "id": "emp-c-162",
    "name": "Juan Marcos",
    "role": "Junior Development Editor",
    "department": "Managing Unit",
    "avatar": "JM",
    "email": "juan.marcos@nexuscorp.com",
    "positionId": "p-corp-161",
    "orgUnitId": "ou-corp-82"
  },
  {
    "id": "emp-c-163",
    "name": "Maria Marcos",
    "role": "Development Editor",
    "department": "Managing Unit",
    "avatar": "MM",
    "email": "maria.marcos@nexuscorp.com",
    "positionId": "p-corp-162",
    "orgUnitId": "ou-corp-82"
  },
  {
    "id": "emp-c-164",
    "name": "Jose Marcos",
    "role": "Administrative Assistant",
    "department": "Managing Unit",
    "avatar": "JM",
    "email": "jose.marcos@nexuscorp.com",
    "positionId": "p-corp-163",
    "orgUnitId": "ou-corp-82"
  },
  {
    "id": "emp-c-165",
    "name": "Andres Marcos",
    "role": "Technical Specialist",
    "department": "Art",
    "avatar": "AM",
    "email": "andres.marcos@nexuscorp.com",
    "positionId": "p-corp-164",
    "orgUnitId": "ou-corp-84"
  },
  {
    "id": "emp-c-166",
    "name": "Antonio Marcos",
    "role": "Sr. Layout Artist",
    "department": "Art",
    "avatar": "AM",
    "email": "antonio.marcos@nexuscorp.com",
    "positionId": "p-corp-165",
    "orgUnitId": "ou-corp-84"
  },
  {
    "id": "emp-c-167",
    "name": "Apolinario Marcos",
    "role": "Production Aide",
    "department": "Art",
    "avatar": "AM",
    "email": "apolinario.marcos@nexuscorp.com",
    "positionId": "p-corp-166",
    "orgUnitId": "ou-corp-84"
  },
  {
    "id": "emp-c-168",
    "name": "Cory Marcos",
    "role": "Lay-out Artist",
    "department": "Art",
    "avatar": "CM",
    "email": "cory.marcos@nexuscorp.com",
    "positionId": "p-corp-167",
    "orgUnitId": "ou-corp-84"
  },
  {
    "id": "emp-c-169",
    "name": "Ferdinand Marcos",
    "role": "Illustrator",
    "department": "Art",
    "avatar": "FM",
    "email": "ferdinand.marcos@nexuscorp.com",
    "positionId": "p-corp-168",
    "orgUnitId": "ou-corp-84"
  },
  {
    "id": "emp-c-170",
    "name": "Rodrigo Marcos",
    "role": "Graphic Artist",
    "department": "Art",
    "avatar": "RM",
    "email": "rodrigo.marcos@nexuscorp.com",
    "positionId": "p-corp-169",
    "orgUnitId": "ou-corp-84"
  },
  {
    "id": "emp-c-171",
    "name": "Leni Marcos",
    "role": "Art Supervisor",
    "department": "Art",
    "avatar": "LM",
    "email": "leni.marcos@nexuscorp.com",
    "positionId": "p-corp-170",
    "orgUnitId": "ou-corp-84"
  },
  {
    "id": "emp-c-172",
    "name": "Grace Marcos",
    "role": "Art Director",
    "department": "Art",
    "avatar": "GM",
    "email": "grace.marcos@nexuscorp.com",
    "positionId": "p-corp-171",
    "orgUnitId": "ou-corp-84"
  },
  {
    "id": "emp-c-173",
    "name": "Jejomar Marcos",
    "role": "Lay-out Artist",
    "department": "Art",
    "avatar": "JM",
    "email": "jejomar.marcos@nexuscorp.com",
    "positionId": "p-corp-172",
    "orgUnitId": "ou-corp-84"
  },
  {
    "id": "emp-c-174",
    "name": "Mar Marcos",
    "role": "Book Editor",
    "department": "P4 Production",
    "avatar": "MM",
    "email": "mar.marcos@nexuscorp.com",
    "positionId": "p-corp-173",
    "orgUnitId": "ou-corp-86"
  },
  {
    "id": "emp-c-175",
    "name": "Richard Marcos",
    "role": "Editor-In-Chief",
    "department": "P4 Production",
    "avatar": "RM",
    "email": "richard.marcos@nexuscorp.com",
    "positionId": "p-corp-174",
    "orgUnitId": "ou-corp-86"
  },
  {
    "id": "emp-c-176",
    "name": "Ping Marcos",
    "role": "Copy Editor",
    "department": "P4 Production",
    "avatar": "PM",
    "email": "ping.marcos@nexuscorp.com",
    "positionId": "p-corp-175",
    "orgUnitId": "ou-corp-86"
  },
  {
    "id": "emp-c-177",
    "name": "Henry Marcos",
    "role": "Book Editor",
    "department": "P4 Production",
    "avatar": "HM",
    "email": "henry.marcos@nexuscorp.com",
    "positionId": "p-corp-176",
    "orgUnitId": "ou-corp-86"
  },
  {
    "id": "emp-c-178",
    "name": "Lucio Marcos",
    "role": "Magazine Editor",
    "department": "SEM",
    "avatar": "LM",
    "email": "lucio.marcos@nexuscorp.com",
    "positionId": "p-corp-177",
    "orgUnitId": "ou-corp-88"
  },
  {
    "id": "emp-c-179",
    "name": "Tony Marcos",
    "role": "Editor in Chief (SEM)",
    "department": "SEM",
    "avatar": "TM",
    "email": "tony.marcos@nexuscorp.com",
    "positionId": "p-corp-178",
    "orgUnitId": "ou-corp-88"
  },
  {
    "id": "emp-c-180",
    "name": "Lance Marcos",
    "role": "Copy Editor",
    "department": "SEM",
    "avatar": "LM",
    "email": "lance.marcos@nexuscorp.com",
    "positionId": "p-corp-179",
    "orgUnitId": "ou-corp-88"
  },
  {
    "id": "emp-c-181",
    "name": "Louis Duterte",
    "role": "Copy Editor",
    "department": "Research and Development Unit",
    "avatar": "LD",
    "email": "louis.duterte@nexuscorp.com",
    "positionId": "p-corp-180",
    "orgUnitId": "ou-corp-90"
  },
  {
    "id": "emp-c-182",
    "name": "Juan Duterte",
    "role": "Book Editor",
    "department": "Research and Development Unit",
    "avatar": "JD",
    "email": "juan.duterte@nexuscorp.com",
    "positionId": "p-corp-181",
    "orgUnitId": "ou-corp-90"
  },
  {
    "id": "emp-c-183",
    "name": "Maria Duterte",
    "role": "Technical Support Technician",
    "department": "DOC-eLearning",
    "avatar": "MD",
    "email": "maria.duterte@nexuscorp.com",
    "positionId": "p-corp-182",
    "orgUnitId": "ou-corp-92"
  },
  {
    "id": "emp-c-184",
    "name": "Jose Duterte",
    "role": "Technical Support Technician 2",
    "department": "DOC-eLearning",
    "avatar": "JD",
    "email": "jose.duterte@nexuscorp.com",
    "positionId": "p-corp-183",
    "orgUnitId": "ou-corp-93"
  },
  {
    "id": "emp-c-185",
    "name": "Andres Duterte",
    "role": "Technical Support Technician",
    "department": "DOC-eLearning",
    "avatar": "AD",
    "email": "andres.duterte@nexuscorp.com",
    "positionId": "p-corp-184",
    "orgUnitId": "ou-corp-93"
  },
  {
    "id": "emp-c-186",
    "name": "Antonio Duterte",
    "role": "Technical Support Supervisor",
    "department": "DOC-eLearning",
    "avatar": "AD",
    "email": "antonio.duterte@nexuscorp.com",
    "positionId": "p-corp-185",
    "orgUnitId": "ou-corp-93"
  },
  {
    "id": "emp-c-187",
    "name": "Apolinario Duterte",
    "role": "Harwdware Specialist",
    "department": "DOC-eLearning",
    "avatar": "AD",
    "email": "apolinario.duterte@nexuscorp.com",
    "positionId": "p-corp-186",
    "orgUnitId": "ou-corp-93"
  },
  {
    "id": "emp-c-188",
    "name": "Cory Duterte",
    "role": "e-Learning Cabling & Hardware Assistant",
    "department": "DOC-eLearning",
    "avatar": "CD",
    "email": "cory.duterte@nexuscorp.com",
    "positionId": "p-corp-187",
    "orgUnitId": "ou-corp-93"
  },
  {
    "id": "emp-c-189",
    "name": "Ferdinand Duterte",
    "role": "E-learning Aftersales Specialist",
    "department": "DOC-eLearning",
    "avatar": "FD",
    "email": "ferdinand.duterte@nexuscorp.com",
    "positionId": "p-corp-188",
    "orgUnitId": "ou-corp-93"
  },
  {
    "id": "emp-c-190",
    "name": "Rodrigo Duterte",
    "role": "Cabling Supervisor",
    "department": "DOC-eLearning",
    "avatar": "RD",
    "email": "rodrigo.duterte@nexuscorp.com",
    "positionId": "p-corp-189",
    "orgUnitId": "ou-corp-93"
  },
  {
    "id": "emp-c-191",
    "name": "Leni Duterte",
    "role": "Cabling Assistant",
    "department": "DOC-eLearning",
    "avatar": "LD",
    "email": "leni.duterte@nexuscorp.com",
    "positionId": "p-corp-190",
    "orgUnitId": "ou-corp-93"
  },
  {
    "id": "emp-c-192",
    "name": "Grace Duterte",
    "role": "Production Manager",
    "department": "Print",
    "avatar": "GD",
    "email": "grace.duterte@nexuscorp.com",
    "positionId": "p-corp-191",
    "orgUnitId": "ou-corp-95"
  },
  {
    "id": "emp-c-193",
    "name": "Jejomar Duterte",
    "role": "Print Supervisor",
    "department": "Print",
    "avatar": "JD",
    "email": "jejomar.duterte@nexuscorp.com",
    "positionId": "p-corp-192",
    "orgUnitId": "ou-corp-95"
  },
  {
    "id": "emp-c-194",
    "name": "Mar Duterte",
    "role": "Print Specialist",
    "department": "Print",
    "avatar": "MD",
    "email": "mar.duterte@nexuscorp.com",
    "positionId": "p-corp-193",
    "orgUnitId": "ou-corp-95"
  },
  {
    "id": "emp-c-195",
    "name": "Richard Duterte",
    "role": "Traffic Helper",
    "department": "Traffic",
    "avatar": "RD",
    "email": "richard.duterte@nexuscorp.com",
    "positionId": "p-corp-194",
    "orgUnitId": "ou-corp-97"
  },
  {
    "id": "emp-c-196",
    "name": "Ping Duterte",
    "role": "Traffic Helper",
    "department": "Traffic",
    "avatar": "PD",
    "email": "ping.duterte@nexuscorp.com",
    "positionId": "p-corp-195",
    "orgUnitId": "ou-corp-96"
  },
  {
    "id": "emp-c-197",
    "name": "Henry Duterte",
    "role": "Driver",
    "department": "Traffic",
    "avatar": "HD",
    "email": "henry.duterte@nexuscorp.com",
    "positionId": "p-corp-196",
    "orgUnitId": "ou-corp-96"
  },
  {
    "id": "emp-c-198",
    "name": "Lucio Duterte",
    "role": "Traffic Supervisor",
    "department": "Traffic",
    "avatar": "LD",
    "email": "lucio.duterte@nexuscorp.com",
    "positionId": "p-corp-197",
    "orgUnitId": "ou-corp-98"
  },
  {
    "id": "emp-c-199",
    "name": "Tony Duterte",
    "role": "Traffic Helper",
    "department": "Traffic",
    "avatar": "TD",
    "email": "tony.duterte@nexuscorp.com",
    "positionId": "p-corp-198",
    "orgUnitId": "ou-corp-98"
  },
  {
    "id": "emp-c-200",
    "name": "Lance Duterte",
    "role": "Traffic Assistant",
    "department": "Traffic",
    "avatar": "LD",
    "email": "lance.duterte@nexuscorp.com",
    "positionId": "p-corp-199",
    "orgUnitId": "ou-corp-98"
  },
  {
    "id": "emp-c-201",
    "name": "Louis Robredo",
    "role": "Delivery Assistant",
    "department": "Traffic",
    "avatar": "LR",
    "email": "louis.robredo@nexuscorp.com",
    "positionId": "p-corp-200",
    "orgUnitId": "ou-corp-98"
  },
  {
    "id": "emp-c-202",
    "name": "Juan Robredo",
    "role": "Operations Support Supervisor",
    "department": "Operations Support",
    "avatar": "JR",
    "email": "juan.robredo@nexuscorp.com",
    "positionId": "p-corp-201",
    "orgUnitId": "ou-corp-100"
  },
  {
    "id": "emp-c-203",
    "name": "Maria Robredo",
    "role": "Operations Support Assistant",
    "department": "Operations Support",
    "avatar": "MR",
    "email": "maria.robredo@nexuscorp.com",
    "positionId": "p-corp-202",
    "orgUnitId": "ou-corp-100"
  },
  {
    "id": "emp-c-204",
    "name": "Jose Robredo",
    "role": "Operations Assistant",
    "department": "Operations Support",
    "avatar": "JR",
    "email": "jose.robredo@nexuscorp.com",
    "positionId": "p-corp-203",
    "orgUnitId": "ou-corp-100"
  },
  {
    "id": "emp-c-205",
    "name": "Andres Robredo",
    "role": "Office and Purchasing Assistant",
    "department": "Operations Support",
    "avatar": "AR",
    "email": "andres.robredo@nexuscorp.com",
    "positionId": "p-corp-204",
    "orgUnitId": "ou-corp-100"
  },
  {
    "id": "emp-c-206",
    "name": "Antonio Robredo",
    "role": "Warehouse Helper",
    "department": "Warehouse",
    "avatar": "AR",
    "email": "antonio.robredo@nexuscorp.com",
    "positionId": "p-corp-205",
    "orgUnitId": "ou-corp-102"
  },
  {
    "id": "emp-c-207",
    "name": "Apolinario Robredo",
    "role": "Warehouse Helper",
    "department": "Warehouse",
    "avatar": "AR",
    "email": "apolinario.robredo@nexuscorp.com",
    "positionId": "p-corp-206",
    "orgUnitId": "ou-corp-101"
  },
  {
    "id": "emp-c-208",
    "name": "Cory Robredo",
    "role": "Warehouse Supervisor",
    "department": "Warehouse",
    "avatar": "CR",
    "email": "cory.robredo@nexuscorp.com",
    "positionId": "p-corp-207",
    "orgUnitId": "ou-corp-103"
  },
  {
    "id": "emp-c-209",
    "name": "Ferdinand Robredo",
    "role": "Warehouse Helper",
    "department": "Warehouse",
    "avatar": "FR",
    "email": "ferdinand.robredo@nexuscorp.com",
    "positionId": "p-corp-208",
    "orgUnitId": "ou-corp-103"
  },
  {
    "id": "emp-c-210",
    "name": "Rodrigo Robredo",
    "role": "Warehouse Clerk",
    "department": "Warehouse",
    "avatar": "RR",
    "email": "rodrigo.robredo@nexuscorp.com",
    "positionId": "p-corp-209",
    "orgUnitId": "ou-corp-103"
  },
  {
    "id": "emp-c-211",
    "name": "Leni Robredo",
    "role": "Warehouse Assistant",
    "department": "Warehouse",
    "avatar": "LR",
    "email": "leni.robredo@nexuscorp.com",
    "positionId": "p-corp-210",
    "orgUnitId": "ou-corp-103"
  },
  {
    "id": "emp-c-212",
    "name": "Grace Robredo",
    "role": "Janitor",
    "department": "Warehouse",
    "avatar": "GR",
    "email": "grace.robredo@nexuscorp.com",
    "positionId": "p-corp-211",
    "orgUnitId": "ou-corp-103"
  },
  {
    "id": "emp-c-213",
    "name": "Jejomar Robredo",
    "role": "Office Services Manager",
    "department": "Office Services",
    "avatar": "JR",
    "email": "jejomar.robredo@nexuscorp.com",
    "positionId": "p-corp-212",
    "orgUnitId": "ou-corp-105"
  },
  {
    "id": "emp-c-214",
    "name": "Mar Robredo",
    "role": "Utility Assistant",
    "department": "Sales",
    "avatar": "MR",
    "email": "mar.robredo@nexuscorp.com",
    "positionId": "p-corp-213",
    "orgUnitId": "ou-corp-107"
  },
  {
    "id": "emp-c-215",
    "name": "Richard Robredo",
    "role": "Sewer",
    "department": "Sales",
    "avatar": "RR",
    "email": "richard.robredo@nexuscorp.com",
    "positionId": "p-corp-214",
    "orgUnitId": "ou-corp-107"
  },
  {
    "id": "emp-c-216",
    "name": "Ping Robredo",
    "role": "Sales Processor",
    "department": "Sales",
    "avatar": "PR",
    "email": "ping.robredo@nexuscorp.com",
    "positionId": "p-corp-215",
    "orgUnitId": "ou-corp-107"
  },
  {
    "id": "emp-c-217",
    "name": "Henry Robredo",
    "role": "Jr. Sales Processor",
    "department": "Sales",
    "avatar": "HR",
    "email": "henry.robredo@nexuscorp.com",
    "positionId": "p-corp-216",
    "orgUnitId": "ou-corp-107"
  },
  {
    "id": "emp-c-218",
    "name": "Lucio Robredo",
    "role": "Employee Engagement Specialist",
    "department": "Employee Engagement Unit",
    "avatar": "LR",
    "email": "lucio.robredo@nexuscorp.com",
    "positionId": "p-corp-217",
    "orgUnitId": "ou-corp-109"
  },
  {
    "id": "emp-c-219",
    "name": "Tony Robredo",
    "role": "Learning and Development Specialist",
    "department": "Employee Engagement Unit",
    "avatar": "TR",
    "email": "tony.robredo@nexuscorp.com",
    "positionId": "p-corp-218",
    "orgUnitId": "ou-corp-110"
  },
  {
    "id": "emp-c-220",
    "name": "Lance Robredo",
    "role": "Technical Analyst",
    "department": "Information Technology",
    "avatar": "LR",
    "email": "lance.robredo@nexuscorp.com",
    "positionId": "p-corp-219",
    "orgUnitId": "ou-corp-111"
  },
  {
    "id": "emp-c-221",
    "name": "Louis Poe",
    "role": "Systems Administrator",
    "department": "Information Technology",
    "avatar": "LP",
    "email": "louis.poe@nexuscorp.com",
    "positionId": "p-corp-220",
    "orgUnitId": "ou-corp-111"
  },
  {
    "id": "emp-c-222",
    "name": "Juan Poe",
    "role": "Quality Assurance Analyst",
    "department": "Information Technology",
    "avatar": "JP",
    "email": "juan.poe@nexuscorp.com",
    "positionId": "p-corp-221",
    "orgUnitId": "ou-corp-111"
  },
  {
    "id": "emp-c-223",
    "name": "Maria Poe",
    "role": "Junior Programmer",
    "department": "Information Technology",
    "avatar": "MP",
    "email": "maria.poe@nexuscorp.com",
    "positionId": "p-corp-222",
    "orgUnitId": "ou-corp-111"
  },
  {
    "id": "emp-c-224",
    "name": "Jose Poe",
    "role": "Junior Developer",
    "department": "Information Technology",
    "avatar": "JP",
    "email": "jose.poe@nexuscorp.com",
    "positionId": "p-corp-223",
    "orgUnitId": "ou-corp-111"
  },
  {
    "id": "emp-c-225",
    "name": "Andres Poe",
    "role": "IT Systems Support",
    "department": "Information Technology",
    "avatar": "AP",
    "email": "andres.poe@nexuscorp.com",
    "positionId": "p-corp-224",
    "orgUnitId": "ou-corp-111"
  },
  {
    "id": "emp-c-226",
    "name": "Antonio Poe",
    "role": "Technical Support Technician",
    "department": "Information Technology",
    "avatar": "AP",
    "email": "antonio.poe@nexuscorp.com",
    "positionId": "p-corp-225",
    "orgUnitId": "ou-corp-112"
  },
  {
    "id": "emp-c-227",
    "name": "Apolinario Poe",
    "role": "Technical Analyst",
    "department": "Information Technology",
    "avatar": "AP",
    "email": "apolinario.poe@nexuscorp.com",
    "positionId": "p-corp-226",
    "orgUnitId": "ou-corp-112"
  },
  {
    "id": "emp-c-228",
    "name": "Cory Poe",
    "role": "Senior Developer",
    "department": "Information Technology",
    "avatar": "CP",
    "email": "cory.poe@nexuscorp.com",
    "positionId": "p-corp-227",
    "orgUnitId": "ou-corp-112"
  },
  {
    "id": "emp-c-229",
    "name": "Ferdinand Poe",
    "role": "Quality Assurance Analyst",
    "department": "Information Technology",
    "avatar": "FP",
    "email": "ferdinand.poe@nexuscorp.com",
    "positionId": "p-corp-228",
    "orgUnitId": "ou-corp-112"
  },
  {
    "id": "emp-c-230",
    "name": "Rodrigo Poe",
    "role": "Network Administrator",
    "department": "Information Technology",
    "avatar": "RP",
    "email": "rodrigo.poe@nexuscorp.com",
    "positionId": "p-corp-229",
    "orgUnitId": "ou-corp-112"
  },
  {
    "id": "emp-c-231",
    "name": "Leni Poe",
    "role": "Junior Programmer",
    "department": "Information Technology",
    "avatar": "LP",
    "email": "leni.poe@nexuscorp.com",
    "positionId": "p-corp-230",
    "orgUnitId": "ou-corp-112"
  },
  {
    "id": "emp-c-232",
    "name": "Grace Poe",
    "role": "Junior Developer",
    "department": "Information Technology",
    "avatar": "GP",
    "email": "grace.poe@nexuscorp.com",
    "positionId": "p-corp-231",
    "orgUnitId": "ou-corp-112"
  },
  {
    "id": "emp-c-233",
    "name": "Jejomar Poe",
    "role": "IT Manager",
    "department": "Information Technology",
    "avatar": "JP",
    "email": "jejomar.poe@nexuscorp.com",
    "positionId": "p-corp-232",
    "orgUnitId": "ou-corp-112"
  },
  {
    "id": "emp-c-234",
    "name": "Mar Poe",
    "role": "Data Center Supervisor",
    "department": "Information Technology",
    "avatar": "MP",
    "email": "mar.poe@nexuscorp.com",
    "positionId": "p-corp-233",
    "orgUnitId": "ou-corp-112"
  },
  {
    "id": "emp-c-235",
    "name": "Richard Poe",
    "role": "Customer Service Specialist",
    "department": "Sales",
    "avatar": "RP",
    "email": "richard.poe@nexuscorp.com",
    "positionId": "p-corp-234",
    "orgUnitId": "ou-corp-114"
  },
  {
    "id": "emp-c-236",
    "name": "Ping Poe",
    "role": "HR Specialist",
    "department": "Human Resource Management",
    "avatar": "PP",
    "email": "ping.poe@nexuscorp.com",
    "positionId": "p-corp-235",
    "orgUnitId": "ou-corp-115"
  },
  {
    "id": "emp-c-237",
    "name": "Henry Poe",
    "role": "HRMD Supervisor",
    "department": "Human Resource Management",
    "avatar": "HP",
    "email": "henry.poe@nexuscorp.com",
    "positionId": "p-corp-236",
    "orgUnitId": "ou-corp-116"
  },
  {
    "id": "emp-c-238",
    "name": "Lucio Poe",
    "role": "HR Specialist",
    "department": "Human Resource Management",
    "avatar": "LP",
    "email": "lucio.poe@nexuscorp.com",
    "positionId": "p-corp-237",
    "orgUnitId": "ou-corp-116"
  },
  {
    "id": "emp-c-239",
    "name": "Tony Poe",
    "role": "HR Specialist",
    "department": "Human Resource Management",
    "avatar": "TP",
    "email": "tony.poe@nexuscorp.com",
    "positionId": "p-corp-238",
    "orgUnitId": "ou-corp-116"
  },
  {
    "id": "emp-c-240",
    "name": "Lance Poe",
    "role": "Field Auditor",
    "department": "Credit and Collections",
    "avatar": "LP",
    "email": "lance.poe@nexuscorp.com",
    "positionId": "p-corp-239",
    "orgUnitId": "ou-corp-118"
  },
  {
    "id": "emp-c-241",
    "name": "Louis Binay",
    "role": "Receptionist",
    "department": "Office Services",
    "avatar": "LB",
    "email": "louis.binay@nexuscorp.com",
    "positionId": "p-corp-240",
    "orgUnitId": "ou-corp-120"
  },
  {
    "id": "emp-c-242",
    "name": "Juan Binay",
    "role": "Office Services Specialist",
    "department": "Office Services",
    "avatar": "JB",
    "email": "juan.binay@nexuscorp.com",
    "positionId": "p-corp-241",
    "orgUnitId": "ou-corp-121"
  },
  {
    "id": "emp-c-243",
    "name": "Maria Binay",
    "role": "Messenger",
    "department": "Office Services",
    "avatar": "MB",
    "email": "maria.binay@nexuscorp.com",
    "positionId": "p-corp-242",
    "orgUnitId": "ou-corp-121"
  },
  {
    "id": "emp-c-244",
    "name": "Jose Binay",
    "role": "Maintenance Crew",
    "department": "Office Services",
    "avatar": "JB",
    "email": "jose.binay@nexuscorp.com",
    "positionId": "p-corp-243",
    "orgUnitId": "ou-corp-121"
  },
  {
    "id": "emp-c-245",
    "name": "Andres Binay",
    "role": "Maintenance Crew",
    "department": "Office Services",
    "avatar": "AB",
    "email": "andres.binay@nexuscorp.com",
    "positionId": "p-corp-244",
    "orgUnitId": "ou-corp-121"
  },
  {
    "id": "emp-c-246",
    "name": "Antonio Binay",
    "role": "Janitor",
    "department": "Office Services",
    "avatar": "AB",
    "email": "antonio.binay@nexuscorp.com",
    "positionId": "p-corp-245",
    "orgUnitId": "ou-corp-121"
  },
  {
    "id": "emp-c-247",
    "name": "Apolinario Binay",
    "role": "AR Specialist",
    "department": "Accounting",
    "avatar": "AB",
    "email": "apolinario.binay@nexuscorp.com",
    "positionId": "p-corp-246",
    "orgUnitId": "ou-corp-122"
  },
  {
    "id": "emp-c-248",
    "name": "Cory Binay",
    "role": "AP Specialist",
    "department": "Accounting",
    "avatar": "CB",
    "email": "cory.binay@nexuscorp.com",
    "positionId": "p-corp-247",
    "orgUnitId": "ou-corp-122"
  },
  {
    "id": "emp-c-249",
    "name": "Ferdinand Binay",
    "role": "Accounting Assistant",
    "department": "Accounting",
    "avatar": "FB",
    "email": "ferdinand.binay@nexuscorp.com",
    "positionId": "p-corp-248",
    "orgUnitId": "ou-corp-122"
  },
  {
    "id": "emp-c-250",
    "name": "Rodrigo Binay",
    "role": "Encoder",
    "department": "Accounting",
    "avatar": "RB",
    "email": "rodrigo.binay@nexuscorp.com",
    "positionId": "p-corp-249",
    "orgUnitId": "ou-corp-123"
  },
  {
    "id": "emp-c-251",
    "name": "Leni Binay",
    "role": "Database Mgmt / Admin Supervisor",
    "department": "Accounting",
    "avatar": "LB",
    "email": "leni.binay@nexuscorp.com",
    "positionId": "p-corp-250",
    "orgUnitId": "ou-corp-123"
  },
  {
    "id": "emp-c-252",
    "name": "Grace Binay",
    "role": "Data Analyst",
    "department": "Accounting",
    "avatar": "GB",
    "email": "grace.binay@nexuscorp.com",
    "positionId": "p-corp-251",
    "orgUnitId": "ou-corp-123"
  },
  {
    "id": "emp-c-253",
    "name": "Jejomar Binay",
    "role": "Cashier / Cash Management",
    "department": "Accounting",
    "avatar": "JB",
    "email": "jejomar.binay@nexuscorp.com",
    "positionId": "p-corp-252",
    "orgUnitId": "ou-corp-123"
  },
  {
    "id": "emp-c-254",
    "name": "Mar Binay",
    "role": "AR Specialist",
    "department": "Accounting",
    "avatar": "MB",
    "email": "mar.binay@nexuscorp.com",
    "positionId": "p-corp-253",
    "orgUnitId": "ou-corp-123"
  },
  {
    "id": "emp-c-255",
    "name": "Richard Binay",
    "role": "AR & Gen Accounting Supervisor",
    "department": "Accounting",
    "avatar": "RB",
    "email": "richard.binay@nexuscorp.com",
    "positionId": "p-corp-254",
    "orgUnitId": "ou-corp-123"
  },
  {
    "id": "emp-c-256",
    "name": "Ping Binay",
    "role": "AR & Compliance Supervisor",
    "department": "Accounting",
    "avatar": "PB",
    "email": "ping.binay@nexuscorp.com",
    "positionId": "p-corp-255",
    "orgUnitId": "ou-corp-123"
  },
  {
    "id": "emp-c-257",
    "name": "Henry Binay",
    "role": "AP Specialist",
    "department": "Accounting",
    "avatar": "HB",
    "email": "henry.binay@nexuscorp.com",
    "positionId": "p-corp-256",
    "orgUnitId": "ou-corp-123"
  },
  {
    "id": "emp-c-258",
    "name": "Lucio Binay",
    "role": "AP & Compliance Supervisor",
    "department": "Accounting",
    "avatar": "LB",
    "email": "lucio.binay@nexuscorp.com",
    "positionId": "p-corp-257",
    "orgUnitId": "ou-corp-123"
  },
  {
    "id": "emp-c-259",
    "name": "Tony Binay",
    "role": "Accounting Manager",
    "department": "Accounting",
    "avatar": "TB",
    "email": "tony.binay@nexuscorp.com",
    "positionId": "p-corp-258",
    "orgUnitId": "ou-corp-123"
  },
  {
    "id": "emp-c-260",
    "name": "Lance Binay",
    "role": "Encoder",
    "department": "Accounting",
    "avatar": "LB",
    "email": "lance.binay@nexuscorp.com",
    "positionId": "p-corp-259",
    "orgUnitId": "ou-corp-124"
  },
  {
    "id": "emp-c-261",
    "name": "Louis Roxas",
    "role": "Accounting Specialist",
    "department": "Accounting",
    "avatar": "LR",
    "email": "louis.roxas@nexuscorp.com",
    "positionId": "p-corp-260",
    "orgUnitId": "ou-corp-124"
  },
  {
    "id": "emp-c-262",
    "name": "Juan Roxas",
    "role": "Executive Assistant",
    "department": "Office of the President",
    "avatar": "JR",
    "email": "juan.roxas@nexuscorp.com",
    "positionId": "p-corp-261",
    "orgUnitId": "ou-corp-125"
  },
  {
    "id": "emp-c-263",
    "name": "Maria Roxas",
    "role": "Driver",
    "department": "Office of the President",
    "avatar": "MR",
    "email": "maria.roxas@nexuscorp.com",
    "positionId": "p-corp-262",
    "orgUnitId": "ou-corp-125"
  },
  {
    "id": "emp-c-264",
    "name": "Jose Roxas",
    "role": "VP of Information Technology",
    "department": "Nexus Corp",
    "avatar": "JR",
    "email": "jose.roxas@nexuscorp.com",
    "positionId": "p-corp-263",
    "orgUnitId": "ou-corp-108"
  },
  {
    "id": "emp-c-265",
    "name": "Andres Roxas",
    "role": "CHRO",
    "department": "Human Resource Management",
    "avatar": "AR",
    "email": "andres.roxas@nexuscorp.com",
    "positionId": "p-corp-264",
    "orgUnitId": "ou-corp-115"
  },
  {
    "id": "emp-c-266",
    "name": "Antonio Roxas",
    "role": "VP of HRMD",
    "department": "Human Resource Management",
    "avatar": "AR",
    "email": "antonio.roxas@nexuscorp.com",
    "positionId": "p-corp-265",
    "orgUnitId": "ou-corp-115"
  },
  {
    "id": "emp-c-267",
    "name": "Aris Junior One",
    "role": "Junior Developer I",
    "department": "Information Technology",
    "avatar": "AJ",
    "email": "aris.one@nexuscorp.com",
    "positionId": "p-corp-223",
    "orgUnitId": "ou-corp-111"
  },
  {
    "id": "emp-c-268",
    "name": "Aris Junior Two",
    "role": "Junior Developer II",
    "department": "Information Technology",
    "avatar": "AJ",
    "email": "aris.two@nexuscorp.com",
    "positionId": "p-corp-223-2",
    "orgUnitId": "ou-corp-111"
  },
  {
    "id": "emp-c-269",
    "name": "Aris Junior Three",
    "role": "Junior Developer III",
    "department": "Information Technology",
    "avatar": "AJ",
    "email": "aris.three@nexuscorp.com",
    "positionId": "p-corp-223-3",
    "orgUnitId": "ou-corp-111"
  },
  {
    "id": "emp-c-270",
    "name": "Aris Junior Four",
    "role": "Junior Developer IV",
    "department": "Information Technology",
    "avatar": "AJ",
    "email": "aris.four@nexuscorp.com",
    "positionId": "p-corp-223-4",
    "orgUnitId": "ou-corp-111"
  }
];
