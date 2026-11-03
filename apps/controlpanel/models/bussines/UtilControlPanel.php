<?php

/**
 * Created by PhpStorm.
 * User: zaldivar
 * Date: 17/11/14
 * Time: 9:45
 */
class UtilControlPanel extends ZendExt_Model
{
    private $_dirPila;

    public function UtilControlPanel()
    {
        parent::ZendExt_Model();
        $this->_dirPila
            = dirname(__FILE__) . '/../../comun/recursos/json/pila.json';

    }

    public function getElement()
    {
        return json_decode(file_get_contents($this->_dirPila), true);
    }

    public function push($name, $version)
    {
        $arrays = $this->getElement();
        $tmp = (isset($arrays['packages'][$name]['arrays']))
            ? $arrays['packages'][$name]['arrays'] : array();
        array_push($tmp, $version);
        $arrays['packages'][$name]['arrays'] = $tmp;
        $this->setElement($arrays);
    }

    public function setElement($arrays)
    {
        file_put_contents($this->_dirPila, json_encode($arrays));
    }

    public function clearStack($name)
    {
        $arrays = $this->getElement();
        unset($arrays['packages'][$name]);
        $this->setElement($arrays);
    }

    public function get($name)
    {
        $arrays = $this->getElement();
        array_pop($arrays['packages'][$name]['arrays']);
        $value = array_pop($arrays['packages'][$name]['arrays']);

        return $value;
    }

    public function pop($name)
    {
        $arrays = $this->getElement();
        $tmparr = $arrays['packages'][$name]['arrays'];
        array_pop($tmparr);
        $arrays['packages'][$name]['arrays'] = $tmparr;
        $this->setElement($arrays);
    }

    public function copyClavePublica($dirrepo, $key, $arraysClaves)
    {

        $context = stream_context_create(
            [
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                ]
            ]
        );
        $html = file_get_contents($dirrepo, null, $context);
        preg_match_all('/<a href=\"([^\"?\/]+)">[^<]*<\/a>/i', $html, $files);
        $bool = true;
        foreach ($files[1] as $file) {
            $varlor = microtime(true);
            $varlor = str_replace(".", "", $varlor);
            $nameFile = $varlor . '.pem';
            $bool = copy(
                $dirrepo . '/' . $file,
                dirname(__FILE__)
                . '/../../../../web/controlpanel/repo/clavesPublicas/'
                . $nameFile,
                $context
            );
            if ($bool) {
                $arraysClaves[$key][] = $nameFile;
            }
        }

        return $arraysClaves;
    }

    public function deleteClavePublica($key, $arraysClaves)
    {
        $dirClave = dirname(__FILE__)
            . '/../../../../web/controlpanel/repo/clavesPublicas/';
        foreach ($arraysClaves[$key] as $file) {
            unlink($dirClave . $file);
        }
        unset($arraysClaves[$key]);

        return $arraysClaves;
    }

    public function getVersionByNameSql($namesql)
    {
        $patern = '/^[1-9]+.[0-9]+.[0-9]+.[0-9]+/';
        for ($i = 0; $i < strlen($namesql); $i++) {
            preg_match(
                $patern,
                substr($namesql, $i),
                $coincidencias,
                PREG_OFFSET_CAPTURE
            );
            if (count($coincidencias) > 0) {
                return $coincidencias[0][0];
            }
        }

        return false;
    }

    public function getArraysNamePackage($cadenaComando)
    {
        $arrays = explode(chr(10), $cadenaComando);
        $arraysPackages = array();
        foreach ($arrays as $line) {
            if ($line != "") {
                $tmp = explode(" ", $line, 2);
                $name = trim($tmp[0]);
                array_push($arraysPackages, array("name" => $name));
            }
        }

        return $arraysPackages;
    }

    public function getArraysPackageInstall($cadenaComando)
    {
        $arrays = explode(chr(10), $cadenaComando);
        $arraysPackages = array();
        foreach ($arrays as $line) {
            if ($line != "") {
                $tmp = explode(" ", $line, 2);
                $name = trim($tmp[0]);
                $tmp = trim($tmp[1]);
                $tmp = explode(" ", $tmp, 2);
                $version = $tmp[0];
                $arraysPackages[$name] = $version;
            }
        }

        return $arraysPackages;
    }

    public function getArraysPackageAviable($cadenaComando)
    {
        $arrays = explode(chr(10), $cadenaComando);
        $arraysVersion = array();
        $name = "";
        foreach ($arrays as $line) {
            if ($line != "") {
                $arraysPropiedades = explode(":", $line);
                $key = trim($arraysPropiedades[0]);
                $value = trim($arraysPropiedades[1]);
                switch ($key) {
                    case 'name':
                        $name = $value;
                        break;
                    case 'versions':
                        $value = str_replace("*", "", $value);
                        $value = str_replace(" ", "", $value);
                        $arraysVersion = explode(",", $value);
                        break;
                }
            }
        }

        return array("name" => $name, "versions" => $arraysVersion);
    }

    public function getVersionMayor($versions)
    {
        sort($versions);

        return $versions[count($versions) - 1];
    }

    public function clearCacheMT()
    {
        $cache = ZendExt_Cache::getInstance();
        $cache->clean();
    }
}