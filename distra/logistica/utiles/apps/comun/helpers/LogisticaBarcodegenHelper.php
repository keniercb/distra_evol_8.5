<?php

/**
 * Description of LogisticaBarcodegenHelper
 *
 * @author kenier
 */
class LogisticaBarcodegenHelper implements ISingletonClass
{

    const BCG_EAN13 = 13,
        BCG_CODE39 = 39;

    private static $instance = null;

    private function __construct()
    {
        
    }

    /**
     * 
     * @return LogisticaBarcodegenHelper
     */
    static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new LogisticaBarcodegenHelper;
        }
        return self::$instance;
    }

    private function factoryBarcodeClass($type)
    {
        switch ($type) {
            case LogisticaBarcodegenHelper::BCG_EAN13:
                return new BCGean13();
            case LogisticaBarcodegenHelper::BCG_CODE39:
                return new BCGcode39();
            default:
                break;
        }
    }

    public function generateBarCode($info)
    {
        $colorBlack = new BCGColor(0, 0, 0);
        $colorWhite = new BCGColor(255, 255, 255);
        $barCode = $this->factoryBarcodeClass($info['tipo']);
        $barCode->setThickness(max(9, min(90, intval(30))));
        $font = new BCGFontFile('../comun/barcodegen/font/Arial.ttf', intval(8));
        $barCode->setFont($font);

        $barCode->setScale(max(1, min(4, 1)));
        $barCode->setBackgroundColor($colorWhite);
        $barCode->setForegroundColor($colorBlack);
        $barCode->parse($info['codigo']);
        if ($info['checksum'] == true) {
            $info['codigo'] = $barCode->getText() . '' . $barCode->getChecksum();
        }
        $drawing = new BCGDrawing('', $colorWhite);
        $drawing->setBarcode($barCode);
        $drawing->setRotationAngle(0);
        $drawing->setDPI(max(72, min(300, intval(72))));
        $drawing->draw();
        $info['barcode'] = 'data:image/jpg;base64,' . base64_encode($drawing->finish(1));
        return $info;
    }

    public function generateQrCode($info)
    {
        $qr = new QRCode();
        $qr->setTypeNumber(10);
        $qr->addData($info['datos']);
        $qr->make();
        $im = $qr->createImage(4, 8);

        return $im;
    }

}
