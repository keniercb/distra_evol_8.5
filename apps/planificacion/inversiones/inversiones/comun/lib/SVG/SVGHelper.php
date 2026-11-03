<?php

require_once __DIR__ . "/svglib/svglib.php";

class SVGHelper
{
    protected $svg;
    protected $filedir;

    /**
     * SVGHelper constructor.
     */
    public function __construct($svg = "", $svg2 = "", $clean = false)
    {
        $this->filedir = __DIR__ . '/output/test';
        $this->createSvg($svg, $svg2, $clean);
        $this->asXMLExport();
    }

    public function createSvg($svg, $svg2, $clean = false)
    {
        $svg2 = str_replace('<rect fill-opacity="0.005" fill="#fff" stroke="none" stroke-width="0" ry="0" rx="0" height="18" width="242" y="0" x="32"></rect>', '', $svg2);
        $content = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg version="1.1" style="width: 1510px; height: 624px; top: 0px; left: 0px;" viewBox="0 0 1510 624"><g id="grafica" transform="translate(0,0)">' . $svg . '</g><g id="leyenda" transform="translate(0,0)">' . $svg2 . '</g></svg>';
        $f = fopen($this->filedir . '.svg', 'w');
        fwrite($f, $content);
        fclose($f);
        $this->svg = SVGDocument::createFromSvg(file_get_contents($this->filedir . '.svg'));
        if ($clean) {
            SVGDocument::cleanXML($this->svg);
        }
        return $this;
    }

    public function asXMLExport()
    {
        $this->svg->asXML($this->filedir . '.svgz', true);
        $this->svg->export($this->filedir . '.png');
        return $this;
    }

    public function getFileBase64()
    {
        return base64_encode(file_get_contents($this->filedir . '.png'));
    }
}