<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Companies
 *
 * @ORM\Table(name="companies", indexes={@ORM\Index(name="Companies_d860be3c", columns={"CountryC"}), @ORM\Index(name="Companies_b376980e", columns={"CityC"}), @ORM\Index(name="Companies_a3c9d75e", columns={"CompanyType"}), @ORM\Index(name="Companies_494063b5", columns={"DefaultCustomer"}), @ORM\Index(name="Companies_5da967c3", columns={"DefaultCashier"}), @ORM\Index(name="Companies_4d5ba1a7", columns={"DefaultIncomeVAT"}), @ORM\Index(name="Companies_406ec824", columns={"StampDevice"}), @ORM\Index(name="Companies_4c1c18be", columns={"DefaultItem"}), @ORM\Index(name="Companies_75a9a664", columns={"DefaultImporter"}), @ORM\Index(name="Companies_85ab9a21", columns={"DefaultManufacturer"})})
 * @ORM\Entity(repositoryClass="AppBundle\Entity\CompaniesRepository")
 */
class Companies
{
    /**
     * @var integer
     *
     * @ORM\Column(name="C", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $c;

    /**
     * @var string
     *
     * @ORM\Column(name="Email", type="string", length=50, nullable=false)
     */
    private $email;

    /**
     * @var string
     *
     * @ORM\Column(name="Password", type="string", length=20, nullable=false)
     */
    private $password;

    /**
     * @var string
     *
     * @ORM\Column(name="Nm", type="string", length=50, nullable=false)
     */
    private $nm;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="DateClose", type="datetime", nullable=true)
     */
    private $dateclose;

    /**
     * @var integer
     *
     * @ORM\Column(name="CountryC", type="integer", nullable=false)
     */
    private $countryc;

    /**
     * @var integer
     *
     * @ORM\Column(name="CityC", type="integer", nullable=true)
     */
    private $cityc;

    /**
     * @var string
     *
     * @ORM\Column(name="Address", type="string", length=50, nullable=false)
     */
    private $address;

    /**
     * @var string
     *
     * @ORM\Column(name="PhoneAreaCode", type="string", length=3, nullable=false)
     */
    private $phoneareacode;

    /**
     * @var string
     *
     * @ORM\Column(name="PhoneNumber", type="string", length=12, nullable=false)
     */
    private $phonenumber;

    /**
     * @var string
     *
     * @ORM\Column(name="MobileAreaCode", type="string", length=3, nullable=false)
     */
    private $mobileareacode;

    /**
     * @var string
     *
     * @ORM\Column(name="MobileNumber", type="string", length=12, nullable=false)
     */
    private $mobilenumber;

    /**
     * @var string
     *
     * @ORM\Column(name="FaxAreaCode", type="string", length=3, nullable=false)
     */
    private $faxareacode;

    /**
     * @var string
     *
     * @ORM\Column(name="FaxNumber", type="string", length=12, nullable=false)
     */
    private $faxnumber;

    /**
     * @var integer
     *
     * @ORM\Column(name="CompanyType", type="integer", nullable=true)
     */
    private $companytype;

    /**
     * @var string
     *
     * @ORM\Column(name="CompanyID", type="string", length=20, nullable=false)
     */
    private $companyid;

    /**
     * @var integer
     *
     * @ORM\Column(name="DefaultCustomer", type="integer", nullable=true)
     */
    private $defaultcustomer;

    /**
     * @var integer
     *
     * @ORM\Column(name="DefaultCashier", type="integer", nullable=true)
     */
    private $defaultcashier;

    /**
     * @var integer
     *
     * @ORM\Column(name="DefaultIncomeVAT", type="integer", nullable=true)
     */
    private $defaultincomevat;

    /**
     * @var integer
     *
     * @ORM\Column(name="DefaultIncome", type="integer", nullable=true)
     */
    private $defaultincome;

    /**
     * @var string
     *
     * @ORM\Column(name="LogoImage", type="string", length=100, nullable=false)
     */
    private $logoimage;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_created", type="datetime", nullable=false)
     */
    private $dateCreated;

    /**
     * @var boolean
     *
     * @ORM\Column(name="show_company_online", type="boolean", nullable=false)
     */
    private $showCompanyOnline;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", nullable=true)
     */
    private $description;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="StamdDate", type="datetime", nullable=true)
     */
    private $stamddate;

    /**
     * @var integer
     *
     * @ORM\Column(name="StampDevice", type="integer", nullable=true)
     */
    private $stampdevice;

    /**
     * @var boolean
     *
     * @ORM\Column(name="SwDelete", type="boolean", nullable=false)
     */
    private $swdelete;

    /**
     * @var string
     *
     * @ORM\Column(name="sftp_password", type="string", length=255, nullable=true)
     */
    private $sftpPassword;

    /**
     * @var string
     *
     * @ORM\Column(name="sftp_url", type="string", length=255, nullable=true)
     */
    private $sftpUrl;

    /**
     * @var string
     *
     * @ORM\Column(name="sftp_username", type="string", length=255, nullable=true)
     */
    private $sftpUsername;

    /**
     * @var string
     *
     * @ORM\Column(name="amo_crm_domain", type="string", length=255, nullable=true)
     */
    private $amoCrmDomain;

    /**
     * @var string
     *
     * @ORM\Column(name="amo_crm_key", type="string", length=255, nullable=true)
     */
    private $amoCrmKey;

    /**
     * @var string
     *
     * @ORM\Column(name="amo_crm_login", type="string", length=255, nullable=true)
     */
    private $amoCrmLogin;

    /**
     * @var integer
     *
     * @ORM\Column(name="DefaultItem", type="integer", nullable=true)
     */
    private $defaultitem;

    /**
     * @var string
     *
     * @ORM\Column(name="BankAccount", type="string", length=20, nullable=true)
     */
    private $bankaccount;

    /**
     * @var string
     *
     * @ORM\Column(name="CompanyRegister", type="string", length=20, nullable=true)
     */
    private $companyregister;

    /**
     * @var string
     *
     * @ORM\Column(name="RegisterCode", type="string", length=20, nullable=true)
     */
    private $registercode;

    /**
     * @var float
     *
     * @ORM\Column(name="ShareCapital", type="float", precision=10, scale=0, nullable=true)
     */
    private $sharecapital;

    /**
     * @var integer
     *
     * @ORM\Column(name="DefaultUnit", type="integer", nullable=true)
     */
    private $defaultunit;

    /**
     * @var integer
     *
     * @ORM\Column(name="DefaultImporter", type="integer", nullable=true)
     */
    private $defaultimporter;

    /**
     * @var integer
     *
     * @ORM\Column(name="DefaultManufacturer", type="integer", nullable=true)
     */
    private $defaultmanufacturer;

    /**
     * @var boolean
     *
     * @ORM\Column(name="include_vat", type="boolean", nullable=false)
     */
    private $includeVat;

    /**
     * @var integer
     *
     * @ORM\Column(name="barcode_type", type="integer", nullable=false)
     */
    private $barcodeType;

    /**
     * @var integer
     *
     * @ORM\Column(name="payment_type", type="integer", nullable=false)
     */
    private $paymentType;

    /**
     * @var string
     *
     * @ORM\Column(name="WebSite", type="string", length=150, nullable=false)
     */
    private $website;

    /**
     * @var integer
     *
     * @ORM\Column(name="views", type="integer", nullable=false)
     */
    private $views = '0';



    /**
     * Get c
     *
     * @return integer
     */
    public function getC()
    {
        return $this->c;
    }

    /**
     * Set email
     *
     * @param string $email
     *
     * @return Companies
     */
    public function setEmail($email)
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Get email
     *
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set password
     *
     * @param string $password
     *
     * @return Companies
     */
    public function setPassword($password)
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Get password
     *
     * @return string
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * Set nm
     *
     * @param string $nm
     *
     * @return Companies
     */
    public function setNm($nm)
    {
        $this->nm = $nm;

        return $this;
    }

    /**
     * Get nm
     *
     * @return string
     */
    public function getNm()
    {
        return $this->nm;
    }

    /**
     * Set dateclose
     *
     * @param \DateTime $dateclose
     *
     * @return Companies
     */
    public function setDateclose($dateclose)
    {
        $this->dateclose = $dateclose;

        return $this;
    }

    /**
     * Get dateclose
     *
     * @return \DateTime
     */
    public function getDateclose()
    {
        return $this->dateclose;
    }

    /**
     * Set countryc
     *
     * @param integer $countryc
     *
     * @return Companies
     */
    public function setCountryc($countryc)
    {
        $this->countryc = $countryc;

        return $this;
    }

    /**
     * Get countryc
     *
     * @return integer
     */
    public function getCountryc()
    {
        return $this->countryc;
    }

    /**
     * Set cityc
     *
     * @param integer $cityc
     *
     * @return Companies
     */
    public function setCityc($cityc)
    {
        $this->cityc = $cityc;

        return $this;
    }

    /**
     * Get cityc
     *
     * @return integer
     */
    public function getCityc()
    {
        return $this->cityc;
    }

    /**
     * Set address
     *
     * @param string $address
     *
     * @return Companies
     */
    public function setAddress($address)
    {
        $this->address = $address;

        return $this;
    }

    /**
     * Get address
     *
     * @return string
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * Set phoneareacode
     *
     * @param string $phoneareacode
     *
     * @return Companies
     */
    public function setPhoneareacode($phoneareacode)
    {
        $this->phoneareacode = $phoneareacode;

        return $this;
    }

    /**
     * Get phoneareacode
     *
     * @return string
     */
    public function getPhoneareacode()
    {
        return $this->phoneareacode;
    }

    /**
     * Set phonenumber
     *
     * @param string $phonenumber
     *
     * @return Companies
     */
    public function setPhonenumber($phonenumber)
    {
        $this->phonenumber = $phonenumber;

        return $this;
    }

    /**
     * Get phonenumber
     *
     * @return string
     */
    public function getPhonenumber()
    {
        return $this->phonenumber;
    }

    /**
     * Set mobileareacode
     *
     * @param string $mobileareacode
     *
     * @return Companies
     */
    public function setMobileareacode($mobileareacode)
    {
        $this->mobileareacode = $mobileareacode;

        return $this;
    }

    /**
     * Get mobileareacode
     *
     * @return string
     */
    public function getMobileareacode()
    {
        return $this->mobileareacode;
    }

    /**
     * Set mobilenumber
     *
     * @param string $mobilenumber
     *
     * @return Companies
     */
    public function setMobilenumber($mobilenumber)
    {
        $this->mobilenumber = $mobilenumber;

        return $this;
    }

    /**
     * Get mobilenumber
     *
     * @return string
     */
    public function getMobilenumber()
    {
        return $this->mobilenumber;
    }

    /**
     * Set faxareacode
     *
     * @param string $faxareacode
     *
     * @return Companies
     */
    public function setFaxareacode($faxareacode)
    {
        $this->faxareacode = $faxareacode;

        return $this;
    }

    /**
     * Get faxareacode
     *
     * @return string
     */
    public function getFaxareacode()
    {
        return $this->faxareacode;
    }

    /**
     * Set faxnumber
     *
     * @param string $faxnumber
     *
     * @return Companies
     */
    public function setFaxnumber($faxnumber)
    {
        $this->faxnumber = $faxnumber;

        return $this;
    }

    /**
     * Get faxnumber
     *
     * @return string
     */
    public function getFaxnumber()
    {
        return $this->faxnumber;
    }

    /**
     * Set companytype
     *
     * @param integer $companytype
     *
     * @return Companies
     */
    public function setCompanytype($companytype)
    {
        $this->companytype = $companytype;

        return $this;
    }

    /**
     * Get companytype
     *
     * @return integer
     */
    public function getCompanytype()
    {
        return $this->companytype;
    }

    /**
     * Set companyid
     *
     * @param string $companyid
     *
     * @return Companies
     */
    public function setCompanyid($companyid)
    {
        $this->companyid = $companyid;

        return $this;
    }

    /**
     * Get companyid
     *
     * @return string
     */
    public function getCompanyid()
    {
        return $this->companyid;
    }

    /**
     * Set defaultcustomer
     *
     * @param integer $defaultcustomer
     *
     * @return Companies
     */
    public function setDefaultcustomer($defaultcustomer)
    {
        $this->defaultcustomer = $defaultcustomer;

        return $this;
    }

    /**
     * Get defaultcustomer
     *
     * @return integer
     */
    public function getDefaultcustomer()
    {
        return $this->defaultcustomer;
    }

    /**
     * Set defaultcashier
     *
     * @param integer $defaultcashier
     *
     * @return Companies
     */
    public function setDefaultcashier($defaultcashier)
    {
        $this->defaultcashier = $defaultcashier;

        return $this;
    }

    /**
     * Get defaultcashier
     *
     * @return integer
     */
    public function getDefaultcashier()
    {
        return $this->defaultcashier;
    }

    /**
     * Set defaultincomevat
     *
     * @param integer $defaultincomevat
     *
     * @return Companies
     */
    public function setDefaultincomevat($defaultincomevat)
    {
        $this->defaultincomevat = $defaultincomevat;

        return $this;
    }

    /**
     * Get defaultincomevat
     *
     * @return integer
     */
    public function getDefaultincomevat()
    {
        return $this->defaultincomevat;
    }

    /**
     * Set defaultincome
     *
     * @param integer $defaultincome
     *
     * @return Companies
     */
    public function setDefaultincome($defaultincome)
    {
        $this->defaultincome = $defaultincome;

        return $this;
    }

    /**
     * Get defaultincome
     *
     * @return integer
     */
    public function getDefaultincome()
    {
        return $this->defaultincome;
    }

    /**
     * Set logoimage
     *
     * @param string $logoimage
     *
     * @return Companies
     */
    public function setLogoimage($logoimage)
    {
        $this->logoimage = $logoimage;

        return $this;
    }

    /**
     * Get logoimage
     *
     * @return string
     */
    public function getLogoimage()
    {
        return $this->logoimage;
    }

    /**
     * Set dateCreated
     *
     * @param \DateTime $dateCreated
     *
     * @return Companies
     */
    public function setDateCreated($dateCreated)
    {
        $this->dateCreated = $dateCreated;

        return $this;
    }

    /**
     * Get dateCreated
     *
     * @return \DateTime
     */
    public function getDateCreated()
    {
        return $this->dateCreated;
    }

    /**
     * Set showCompanyOnline
     *
     * @param boolean $showCompanyOnline
     *
     * @return Companies
     */
    public function setShowCompanyOnline($showCompanyOnline)
    {
        $this->showCompanyOnline = $showCompanyOnline;

        return $this;
    }

    /**
     * Get showCompanyOnline
     *
     * @return boolean
     */
    public function getShowCompanyOnline()
    {
        return $this->showCompanyOnline;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return Companies
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set stamddate
     *
     * @param \DateTime $stamddate
     *
     * @return Companies
     */
    public function setStamddate($stamddate)
    {
        $this->stamddate = $stamddate;

        return $this;
    }

    /**
     * Get stamddate
     *
     * @return \DateTime
     */
    public function getStamddate()
    {
        return $this->stamddate;
    }

    /**
     * Set stampdevice
     *
     * @param integer $stampdevice
     *
     * @return Companies
     */
    public function setStampdevice($stampdevice)
    {
        $this->stampdevice = $stampdevice;

        return $this;
    }

    /**
     * Get stampdevice
     *
     * @return integer
     */
    public function getStampdevice()
    {
        return $this->stampdevice;
    }

    /**
     * Set swdelete
     *
     * @param boolean $swdelete
     *
     * @return Companies
     */
    public function setSwdelete($swdelete)
    {
        $this->swdelete = $swdelete;

        return $this;
    }

    /**
     * Get swdelete
     *
     * @return boolean
     */
    public function getSwdelete()
    {
        return $this->swdelete;
    }

    /**
     * Set sftpPassword
     *
     * @param string $sftpPassword
     *
     * @return Companies
     */
    public function setSftpPassword($sftpPassword)
    {
        $this->sftpPassword = $sftpPassword;

        return $this;
    }

    /**
     * Get sftpPassword
     *
     * @return string
     */
    public function getSftpPassword()
    {
        return $this->sftpPassword;
    }

    /**
     * Set sftpUrl
     *
     * @param string $sftpUrl
     *
     * @return Companies
     */
    public function setSftpUrl($sftpUrl)
    {
        $this->sftpUrl = $sftpUrl;

        return $this;
    }

    /**
     * Get sftpUrl
     *
     * @return string
     */
    public function getSftpUrl()
    {
        return $this->sftpUrl;
    }

    /**
     * Set sftpUsername
     *
     * @param string $sftpUsername
     *
     * @return Companies
     */
    public function setSftpUsername($sftpUsername)
    {
        $this->sftpUsername = $sftpUsername;

        return $this;
    }

    /**
     * Get sftpUsername
     *
     * @return string
     */
    public function getSftpUsername()
    {
        return $this->sftpUsername;
    }

    /**
     * Set amoCrmDomain
     *
     * @param string $amoCrmDomain
     *
     * @return Companies
     */
    public function setAmoCrmDomain($amoCrmDomain)
    {
        $this->amoCrmDomain = $amoCrmDomain;

        return $this;
    }

    /**
     * Get amoCrmDomain
     *
     * @return string
     */
    public function getAmoCrmDomain()
    {
        return $this->amoCrmDomain;
    }

    /**
     * Set amoCrmKey
     *
     * @param string $amoCrmKey
     *
     * @return Companies
     */
    public function setAmoCrmKey($amoCrmKey)
    {
        $this->amoCrmKey = $amoCrmKey;

        return $this;
    }

    /**
     * Get amoCrmKey
     *
     * @return string
     */
    public function getAmoCrmKey()
    {
        return $this->amoCrmKey;
    }

    /**
     * Set amoCrmLogin
     *
     * @param string $amoCrmLogin
     *
     * @return Companies
     */
    public function setAmoCrmLogin($amoCrmLogin)
    {
        $this->amoCrmLogin = $amoCrmLogin;

        return $this;
    }

    /**
     * Get amoCrmLogin
     *
     * @return string
     */
    public function getAmoCrmLogin()
    {
        return $this->amoCrmLogin;
    }

    /**
     * Set defaultitem
     *
     * @param integer $defaultitem
     *
     * @return Companies
     */
    public function setDefaultitem($defaultitem)
    {
        $this->defaultitem = $defaultitem;

        return $this;
    }

    /**
     * Get defaultitem
     *
     * @return integer
     */
    public function getDefaultitem()
    {
        return $this->defaultitem;
    }

    /**
     * Set bankaccount
     *
     * @param string $bankaccount
     *
     * @return Companies
     */
    public function setBankaccount($bankaccount)
    {
        $this->bankaccount = $bankaccount;

        return $this;
    }

    /**
     * Get bankaccount
     *
     * @return string
     */
    public function getBankaccount()
    {
        return $this->bankaccount;
    }

    /**
     * Set companyregister
     *
     * @param string $companyregister
     *
     * @return Companies
     */
    public function setCompanyregister($companyregister)
    {
        $this->companyregister = $companyregister;

        return $this;
    }

    /**
     * Get companyregister
     *
     * @return string
     */
    public function getCompanyregister()
    {
        return $this->companyregister;
    }

    /**
     * Set registercode
     *
     * @param string $registercode
     *
     * @return Companies
     */
    public function setRegistercode($registercode)
    {
        $this->registercode = $registercode;

        return $this;
    }

    /**
     * Get registercode
     *
     * @return string
     */
    public function getRegistercode()
    {
        return $this->registercode;
    }

    /**
     * Set sharecapital
     *
     * @param float $sharecapital
     *
     * @return Companies
     */
    public function setSharecapital($sharecapital)
    {
        $this->sharecapital = $sharecapital;

        return $this;
    }

    /**
     * Get sharecapital
     *
     * @return float
     */
    public function getSharecapital()
    {
        return $this->sharecapital;
    }

    /**
     * Set defaultunit
     *
     * @param integer $defaultunit
     *
     * @return Companies
     */
    public function setDefaultunit($defaultunit)
    {
        $this->defaultunit = $defaultunit;

        return $this;
    }

    /**
     * Get defaultunit
     *
     * @return integer
     */
    public function getDefaultunit()
    {
        return $this->defaultunit;
    }

    /**
     * Set defaultimporter
     *
     * @param integer $defaultimporter
     *
     * @return Companies
     */
    public function setDefaultimporter($defaultimporter)
    {
        $this->defaultimporter = $defaultimporter;

        return $this;
    }

    /**
     * Get defaultimporter
     *
     * @return integer
     */
    public function getDefaultimporter()
    {
        return $this->defaultimporter;
    }

    /**
     * Set defaultmanufacturer
     *
     * @param integer $defaultmanufacturer
     *
     * @return Companies
     */
    public function setDefaultmanufacturer($defaultmanufacturer)
    {
        $this->defaultmanufacturer = $defaultmanufacturer;

        return $this;
    }

    /**
     * Get defaultmanufacturer
     *
     * @return integer
     */
    public function getDefaultmanufacturer()
    {
        return $this->defaultmanufacturer;
    }

    /**
     * Set includeVat
     *
     * @param boolean $includeVat
     *
     * @return Companies
     */
    public function setIncludeVat($includeVat)
    {
        $this->includeVat = $includeVat;

        return $this;
    }

    /**
     * Get includeVat
     *
     * @return boolean
     */
    public function getIncludeVat()
    {
        return $this->includeVat;
    }

    /**
     * Set barcodeType
     *
     * @param integer $barcodeType
     *
     * @return Companies
     */
    public function setBarcodeType($barcodeType)
    {
        $this->barcodeType = $barcodeType;

        return $this;
    }

    /**
     * Get barcodeType
     *
     * @return integer
     */
    public function getBarcodeType()
    {
        return $this->barcodeType;
    }

    /**
     * Set paymentType
     *
     * @param integer $paymentType
     *
     * @return Companies
     */
    public function setPaymentType($paymentType)
    {
        $this->paymentType = $paymentType;

        return $this;
    }

    /**
     * Get paymentType
     *
     * @return integer
     */
    public function getPaymentType()
    {
        return $this->paymentType;
    }

    /**
     * Set website
     *
     * @param string $website
     *
     * @return Companies
     */
    public function setWebsite($website)
    {
        $this->website = $website;

        return $this;
    }

    /**
     * Get website
     *
     * @return string
     */
    public function getWebsite()
    {
        return $this->website;
    }

    /**
     * Set views
     *
     * @param integer $views
     *
     * @return Companies
     */
    public function setViews($views)
    {
        $this->views = $views;

        return $this;
    }

    /**
     * Get views
     *
     * @return integer
     */
    public function getViews()
    {
        return $this->views;
    }
}
