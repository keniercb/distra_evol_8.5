<?php

/**
 * Created by PhpStorm.
 * User: adrian
 * Date: 27/10/14
 * Time: 9:29
 */
class ManagerJSCompress extends ZendExt_Model
{

    private $_yuiCompresorPath;
    private $_appsPath;
    private $_webPath;
    private $_unir;

    public function ManagerJSCompress()
    {

        $this->tempDir = sys_get_temp_dir();
        $dirIndex = $_SERVER['SCRIPT_FILENAME'];
        $this->_appsPath
            = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps';
        $this->_webPath
            = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'web';

        $this->_yuiCompresorPath = $this->_appsPath
            . "/package/comun/lib/Yuicompressor/yuicompressor.jar";

        $this->_logJS = $this->_appsPath . "/package/comun/logs/logJS.txt";
        //$this->_logPHP = $this->__appsPath."/uff/comun/logs/logPHP.txt";
        $this->tmp = $this->_appsPath . "/package/comun/tmp/";
        $this->_unir = "";
        parent::ZendExt_Model();
    }

    public function parsePhtml($pack, &$resp)
    {

        $itemsPack = array_diff(scandir($pack), array('.', '..'));
        //var_dump($itemsPack); die();
        foreach ($itemsPack as $value) {
            if (!is_file($pack . $value)) {
                $this->parsePhtml($pack . $value . '/', $resp);
            } else {
                $pathParts = pathinfo($value);
                if ($pathParts['extension'] == 'phtml') {

                    $resp[] = $pack . $value;

                }
            }
        }

    }

    public function ofuscar($dirApps, $dirWeb)
    {
        $respuest = "";
        $this->parsePhtml($dirApps, $respuest);
        $this->yuiPack($respuest, $dirWeb);
    }

    public function isSrcCorrect($src)
    {
        if ($src) {
            $rest = substr($src, 0, 1);
            $nameFile = basename($src);
            if ($rest != '<' && $nameFile != 'ext-all-debug.js'
                && $nameFile != 'ext-all.js'
            ) {
                return true;
            }
        }

        return false;

    }

    public function comprimirJs($dirFileJs)
    {

        if (file_exists($dirFileJs)) {

            $cmdOne = 'java -jar ' . $this->_yuiCompresorPath . ' --type js '
                . $dirFileJs . ' -o ' . $dirFileJs;
            passthru($cmdOne, $respuesta);

            if ($respuesta != 0) {
                UtilModel::write_log(
                    $this->_logJS,
                    'Problemas al comrpimir el JS: ' . $dirFileJs, "Warn Debug"
                );
            } else {
                UtilModel::write_log(
                    $this->_logJS, 'Archivo comprimido: ' . $dirFileJs, "Info"
                );

            }

        } else {
            UtilModel::write_log(
                $this->_logJS, 'El Archivo ' . $dirFileJs . " no se encuentra",
                "Warn Debug"
            );
        }
    }

    public function actualizarPhtml($url, $srcSuper)
    {

        $bandera = true;
        $domDoc = new DOMDocument();
        $domDoc->loadHTMLFile($url);
        $elements = $domDoc->getElementsByTagName('script');
        for ($i = $elements->length; --$i >= 0;) {
            $el = $elements->item($i);
            $variable = $el->getAttribute('src');
            if ($this->isSrcCorrect($variable)) {
                if ($bandera) {
                    $_src = explode("/web/", $srcSuper);
                    $el->setAttribute('src', '/' . $_src[1]);
                    $bandera = false;
                } else {
                    $el->parentNode->removeChild($el);
                }
            }


        }
        $domDoc->saveHTMLFile($url);
        $content = file_get_contents($url, null, $this->getContextOptions());
        file_put_contents($url, urldecode(htmlspecialchars_decode($content)));

    }

    public function yuiPack($phtml, $dirWeb)
    {


        UtilModel::clear_log($this->_logJS);
        $dom = new DOMDocument();

        foreach ($phtml as $url) {

            $dom->loadHTMLFile($url);

            $elements = $dom->getElementsByTagName('script');

            if (!is_null($elements)) {
                foreach ($elements as $element) {
                    $dirJs = $dirWeb;

                    $variable = $element->getAttribute('src');

                    if ($this->isSrcCorrect($variable)) {

                        $absolute = explode("../../", $variable);

                        if (count($absolute) > 1) {
                            $dirJs .= '/' . $absolute[1];
                        } else {
                            $dirJs .= '/' . $absolute[0];
                        }
                        $this->comprimirJs($dirJs);
                    }
                }

            }

        }
    }

    public function getContextOptions() {
        $contextOptions = stream_context_create(
            [
                "ssl" => [
                    "verify_peer" => false,
                    "verify_peer_name" => false,
                    "allow_self_signed" => true
                ],
                "http" => [
                    "timeout" => 10
                ]
            ]
        );
        return $contextOptions;
    }

}