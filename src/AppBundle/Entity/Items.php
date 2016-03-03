<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Items
 *
 * @ORM\Table(name="items", indexes={@ORM\Index(name="Items_0316dde1", columns={"CompanyC"}), @ORM\Index(name="Items_ed4bcf2f", columns={"VatGroup"}), @ORM\Index(name="Items_5f412f9a", columns={"GroupC"}), @ORM\Index(name="Items_b9dcc52b", columns={"unit_id"}), @ORM\Index(name="Items_406ec824", columns={"StampDevice"}), @ORM\Index(name="Items_bc9dcfc6", columns={"importer_id"}), @ORM\Index(name="Items_399a0583", columns={"color_id"}), @ORM\Index(name="Items_16fe489b", columns={"item_model_id"}), @ORM\Index(name="Items_8222f9c0", columns={"size_id"}), @ORM\Index(name="Items_f16bb99f", columns={"item_material_id"}), @ORM\Index(name="Items_cc56b9d2", columns={"item_standard_id"}), @ORM\Index(name="Items_aadc4860", columns={"currency_buy_price_id"}), @ORM\Index(name="Items_47e70af5", columns={"currency_sale_price_id"})})
 * @ORM\Entity(repositoryClass="AppBundle\Entity\ItemsRepository")
 */
class Items
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
     * @var integer
     *
     * @ORM\Column(name="CompanyC", type="integer", nullable=false)
     */
    private $companyc;

    /**
     * @var integer
     *
     * @ORM\Column(name="Code", type="bigint", nullable=false)
     */
    private $code;

    /**
     * @var string
     *
     * @ORM\Column(name="Nm", type="string", length=100, nullable=true)
     */
    private $nm;

    /**
     * @var string
     *
     * @ORM\Column(name="Barcode", type="string", length=13, nullable=false)
     */
    private $barcode;

    /**
     * @var string
     *
     * @ORM\Column(name="BuyPrice", type="decimal", precision=18, scale=2, nullable=true)
     */
    private $buyprice;

    /**
     * @var string
     *
     * @ORM\Column(name="SalePrice", type="decimal", precision=18, scale=2, nullable=true)
     */
    private $saleprice;

    /**
     * @var integer
     *
     * @ORM\Column(name="VatGroup", type="integer", nullable=true)
     */
    private $vatgroup;

    /**
     * @var integer
     *
     * @ORM\Column(name="GroupC", type="integer", nullable=true)
     */
    private $groupc;

    /**
     * @var integer
     *
     * @ORM\Column(name="unit_id", type="integer", nullable=true)
     */
    private $unitId;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="StamdDate", type="datetime", nullable=false)
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
     * @var boolean
     *
     * @ORM\Column(name="SwNotActive", type="boolean", nullable=false)
     */
    private $swnotactive;

    /**
     * @var float
     *
     * @ORM\Column(name="Discount", type="float", precision=10, scale=0, nullable=true)
     */
    private $discount;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", nullable=true)
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(name="Picture", type="string", length=100, nullable=true)
     */
    private $picture;

    /**
     * @var integer
     *
     * @ORM\Column(name="quantity", type="integer", nullable=false)
     */
    private $quantity;

    /**
     * @var boolean
     *
     * @ORM\Column(name="exists_invoices", type="boolean", nullable=false)
     */
    private $existsInvoices;

    /**
     * @var integer
     *
     * @ORM\Column(name="code_foreign", type="integer", nullable=true)
     */
    private $codeForeign;

    /**
     * @var integer
     *
     * @ORM\Column(name="manufacturer_id", type="integer", nullable=true)
     */
    private $manufacturerId;

    /**
     * @var integer
     *
     * @ORM\Column(name="importer_id", type="integer", nullable=true)
     */
    private $importerId;

    /**
     * @var integer
     *
     * @ORM\Column(name="barcode_numerator", type="integer", nullable=true)
     */
    private $barcodeNumerator;

    /**
     * @var integer
     *
     * @ORM\Column(name="color_id", type="integer", nullable=true)
     */
    private $colorId;

    /**
     * @var integer
     *
     * @ORM\Column(name="item_model_id", type="integer", nullable=true)
     */
    private $itemModelId;

    /**
     * @var integer
     *
     * @ORM\Column(name="size_id", type="integer", nullable=true)
     */
    private $sizeId;

    /**
     * @var integer
     *
     * @ORM\Column(name="item_material_id", type="integer", nullable=true)
     */
    private $itemMaterialId;

    /**
     * @var integer
     *
     * @ORM\Column(name="item_standard_id", type="integer", nullable=true)
     */
    private $itemStandardId;

    /**
     * @var integer
     *
     * @ORM\Column(name="currency_buy_price_id", type="integer", nullable=true)
     */
    private $currencyBuyPriceId;

    /**
     * @var integer
     *
     * @ORM\Column(name="currency_sale_price_id", type="integer", nullable=true)
     */
    private $currencySalePriceId;

    /**
     * @var integer
     *
     * @ORM\Column(name="views", type="integer", nullable=true)
     */
    private $views = '0';

    /**
     * @var integer
     *
     * @ORM\Column(name="remote_id", type="integer", nullable=false)
     */
    private $remoteId;



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
     * Set companyc
     *
     * @param integer $companyc
     *
     * @return Items
     */
    public function setCompanyc($companyc)
    {
        $this->companyc = $companyc;

        return $this;
    }

    /**
     * Get companyc
     *
     * @return integer
     */
    public function getCompanyc()
    {
        return $this->companyc;
    }

    /**
     * Set code
     *
     * @param integer $code
     *
     * @return Items
     */
    public function setCode($code)
    {
        $this->code = $code;

        return $this;
    }

    /**
     * Get code
     *
     * @return integer
     */
    public function getCode()
    {
        return $this->code;
    }

    /**
     * Set nm
     *
     * @param string $nm
     *
     * @return Items
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
     * Set barcode
     *
     * @param string $barcode
     *
     * @return Items
     */
    public function setBarcode($barcode)
    {
        $this->barcode = $barcode;

        return $this;
    }

    /**
     * Get barcode
     *
     * @return string
     */
    public function getBarcode()
    {
        return $this->barcode;
    }

    /**
     * Set buyprice
     *
     * @param string $buyprice
     *
     * @return Items
     */
    public function setBuyprice($buyprice)
    {
        $this->buyprice = $buyprice;

        return $this;
    }

    /**
     * Get buyprice
     *
     * @return string
     */
    public function getBuyprice()
    {
        return $this->buyprice;
    }

    /**
     * Set saleprice
     *
     * @param string $saleprice
     *
     * @return Items
     */
    public function setSaleprice($saleprice)
    {
        $this->saleprice = $saleprice;

        return $this;
    }

    /**
     * Get saleprice
     *
     * @return string
     */
    public function getSaleprice()
    {
        return $this->saleprice;
    }

    /**
     * Set vatgroup
     *
     * @param integer $vatgroup
     *
     * @return Items
     */
    public function setVatgroup($vatgroup)
    {
        $this->vatgroup = $vatgroup;

        return $this;
    }

    /**
     * Get vatgroup
     *
     * @return integer
     */
    public function getVatgroup()
    {
        return $this->vatgroup;
    }

    /**
     * Set groupc
     *
     * @param integer $groupc
     *
     * @return Items
     */
    public function setGroupc($groupc)
    {
        $this->groupc = $groupc;

        return $this;
    }

    /**
     * Get groupc
     *
     * @return integer
     */
    public function getGroupc()
    {
        return $this->groupc;
    }

    /**
     * Set unitId
     *
     * @param integer $unitId
     *
     * @return Items
     */
    public function setUnitId($unitId)
    {
        $this->unitId = $unitId;

        return $this;
    }

    /**
     * Get unitId
     *
     * @return integer
     */
    public function getUnitId()
    {
        return $this->unitId;
    }

    /**
     * Set stamddate
     *
     * @param \DateTime $stamddate
     *
     * @return Items
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
     * @return Items
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
     * @return Items
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
     * Set swnotactive
     *
     * @param boolean $swnotactive
     *
     * @return Items
     */
    public function setSwnotactive($swnotactive)
    {
        $this->swnotactive = $swnotactive;

        return $this;
    }

    /**
     * Get swnotactive
     *
     * @return boolean
     */
    public function getSwnotactive()
    {
        return $this->swnotactive;
    }

    /**
     * Set discount
     *
     * @param float $discount
     *
     * @return Items
     */
    public function setDiscount($discount)
    {
        $this->discount = $discount;

        return $this;
    }

    /**
     * Get discount
     *
     * @return float
     */
    public function getDiscount()
    {
        return $this->discount;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return Items
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
     * Set picture
     *
     * @param string $picture
     *
     * @return Items
     */
    public function setPicture($picture)
    {
        $this->picture = $picture;

        return $this;
    }

    /**
     * Get picture
     *
     * @return string
     */
    public function getPicture()
    {
        return $this->picture;
    }

    /**
     * Set quantity
     *
     * @param integer $quantity
     *
     * @return Items
     */
    public function setQuantity($quantity)
    {
        $this->quantity = $quantity;

        return $this;
    }

    /**
     * Get quantity
     *
     * @return integer
     */
    public function getQuantity()
    {
        return $this->quantity;
    }

    /**
     * Set existsInvoices
     *
     * @param boolean $existsInvoices
     *
     * @return Items
     */
    public function setExistsInvoices($existsInvoices)
    {
        $this->existsInvoices = $existsInvoices;

        return $this;
    }

    /**
     * Get existsInvoices
     *
     * @return boolean
     */
    public function getExistsInvoices()
    {
        return $this->existsInvoices;
    }

    /**
     * Set codeForeign
     *
     * @param integer $codeForeign
     *
     * @return Items
     */
    public function setCodeForeign($codeForeign)
    {
        $this->codeForeign = $codeForeign;

        return $this;
    }

    /**
     * Get codeForeign
     *
     * @return integer
     */
    public function getCodeForeign()
    {
        return $this->codeForeign;
    }

    /**
     * Set manufacturerId
     *
     * @param integer $manufacturerId
     *
     * @return Items
     */
    public function setManufacturerId($manufacturerId)
    {
        $this->manufacturerId = $manufacturerId;

        return $this;
    }

    /**
     * Get manufacturerId
     *
     * @return integer
     */
    public function getManufacturerId()
    {
        return $this->manufacturerId;
    }

    /**
     * Set importerId
     *
     * @param integer $importerId
     *
     * @return Items
     */
    public function setImporterId($importerId)
    {
        $this->importerId = $importerId;

        return $this;
    }

    /**
     * Get importerId
     *
     * @return integer
     */
    public function getImporterId()
    {
        return $this->importerId;
    }

    /**
     * Set barcodeNumerator
     *
     * @param integer $barcodeNumerator
     *
     * @return Items
     */
    public function setBarcodeNumerator($barcodeNumerator)
    {
        $this->barcodeNumerator = $barcodeNumerator;

        return $this;
    }

    /**
     * Get barcodeNumerator
     *
     * @return integer
     */
    public function getBarcodeNumerator()
    {
        return $this->barcodeNumerator;
    }

    /**
     * Set colorId
     *
     * @param integer $colorId
     *
     * @return Items
     */
    public function setColorId($colorId)
    {
        $this->colorId = $colorId;

        return $this;
    }

    /**
     * Get colorId
     *
     * @return integer
     */
    public function getColorId()
    {
        return $this->colorId;
    }

    /**
     * Set itemModelId
     *
     * @param integer $itemModelId
     *
     * @return Items
     */
    public function setItemModelId($itemModelId)
    {
        $this->itemModelId = $itemModelId;

        return $this;
    }

    /**
     * Get itemModelId
     *
     * @return integer
     */
    public function getItemModelId()
    {
        return $this->itemModelId;
    }

    /**
     * Set sizeId
     *
     * @param integer $sizeId
     *
     * @return Items
     */
    public function setSizeId($sizeId)
    {
        $this->sizeId = $sizeId;

        return $this;
    }

    /**
     * Get sizeId
     *
     * @return integer
     */
    public function getSizeId()
    {
        return $this->sizeId;
    }

    /**
     * Set itemMaterialId
     *
     * @param integer $itemMaterialId
     *
     * @return Items
     */
    public function setItemMaterialId($itemMaterialId)
    {
        $this->itemMaterialId = $itemMaterialId;

        return $this;
    }

    /**
     * Get itemMaterialId
     *
     * @return integer
     */
    public function getItemMaterialId()
    {
        return $this->itemMaterialId;
    }

    /**
     * Set itemStandardId
     *
     * @param integer $itemStandardId
     *
     * @return Items
     */
    public function setItemStandardId($itemStandardId)
    {
        $this->itemStandardId = $itemStandardId;

        return $this;
    }

    /**
     * Get itemStandardId
     *
     * @return integer
     */
    public function getItemStandardId()
    {
        return $this->itemStandardId;
    }

    /**
     * Set currencyBuyPriceId
     *
     * @param integer $currencyBuyPriceId
     *
     * @return Items
     */
    public function setCurrencyBuyPriceId($currencyBuyPriceId)
    {
        $this->currencyBuyPriceId = $currencyBuyPriceId;

        return $this;
    }

    /**
     * Get currencyBuyPriceId
     *
     * @return integer
     */
    public function getCurrencyBuyPriceId()
    {
        return $this->currencyBuyPriceId;
    }

    /**
     * Set currencySalePriceId
     *
     * @param integer $currencySalePriceId
     *
     * @return Items
     */
    public function setCurrencySalePriceId($currencySalePriceId)
    {
        $this->currencySalePriceId = $currencySalePriceId;

        return $this;
    }

    /**
     * Get currencySalePriceId
     *
     * @return integer
     */
    public function getCurrencySalePriceId()
    {
        return $this->currencySalePriceId;
    }

    /**
     * Set views
     *
     * @param integer $views
     *
     * @return Items
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

    /**
     * Set remoteId
     *
     * @param integer $remoteId
     *
     * @return Items
     */
    public function setRemoteId($remoteId)
    {
        $this->remoteId = $remoteId;

        return $this;
    }

    /**
     * Get remoteId
     *
     * @return integer
     */
    public function getRemoteId()
    {
        return $this->remoteId;
    }
}
