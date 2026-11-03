<?php

/**
 * ControlPanelModel
 *
 * @author  @Adrian Avila Atencio
 * @version $Rev:$
 */
class ControlPanelModel extends ZendExt_Model
{
    private $_util;
    private $_currentPdoConn = null;

    public function ControlPanelModel()
    {
        parent::ZendExt_Model();
        $this->_util = new UtilControlPanel();
    }

    public function readXML($url)
    {
        $xml = simplexml_load_file($url);

        return $xml;
    }

    public function listarPaquetesRlocal($url)
    {
        $strDatos = file_get_contents($url, null, $this->getContextOptions());
        $datos = json_decode($strDatos, true);
        $paquetes = $datos['packages'];

        return $paquetes;
    }

    public function encontrarPaquete($listaPaquetes, $paquete)
    {
        foreach ($listaPaquetes as $paquetes) {
            foreach ($paquetes as $elemt) {
                if ((String)$paquete['ID '] == (String)$elemt['ID']) {
                    return true;
                }
            }
        }

        return false;
    }

    public function urlEsValida($url)
    {
        $handle = fopen($url . 'packages.json', "r", null, $this->getContextOptions());

        if ($handle == false) {
            $status = 0;
        } else {
            $status = 1;
        }
        fclose($handle);

        return $status;
    }

    public function comprobarUrl($url)
    {
        if (@file_get_contents($url, 0, $this->getContextOptions())) {
            return true;
        } else {
            return false;
        }
    }

    public function BuscarPaquete($listaPaquetes, $backFind)
    {
        if ($backFind != null) {
            foreach ($listaPaquetes as $paquete) {
                $backPakage = strtolower($paquete['NAME']);
                $pos = strpos($backPakage, $backFind);
                if ($pos !== false) {
                    $arrayReturn[] = $paquete;
                }
            }
            $listaPaquetes = $arrayReturn;
        }

        return $listaPaquetes;
    }

    public function compararYeliminar($pack, $root)
    {
        $itemsPack = array_diff(scandir($pack), array('.', '..'));
        $itemsRoot = array_diff(scandir($root), array('.', '..'));
        $nuevos = array_intersect($itemsRoot, $itemsPack);
        foreach ($nuevos as $key => $value) {
            if (!is_file($pack . $value)) {
                $this->compararYEliminar(
                    $pack . $value . '/',
                    $root . $value . '/'
                );
                if (count(array_diff(scandir($root . $value), array('.', '..'))) == 0
                ) {
                    rmdir($root . $value);
                }
            } else {
                unlink($root . $value);
            }
        }
    }

    public function locateScripts($pack, &$resp)
    {
        $itemsPack = array_diff(scandir($pack), array('.', '..'));
        foreach ($itemsPack as $value) {
            if (!is_file($pack . $value)) {
                $this->locateScripts($pack . $value . '/', $resp);
            } else {
                if ($value == 'script.ini') {
                    $resp = $pack . $value;
                }
            }
        }

        return false;
    }

    public function locateSystemXML($pack, &$resp)
    {
        $itemsPack = array_diff(scandir($pack), array('.', '..'));
        foreach ($itemsPack as $value) {
            if (!is_file($pack . $value)) {
                $this->locateSystemXML($pack . $value . '/', $resp);
            } else {
                if ($value == 'sistemas.xml') {
                    $resp = $pack . $value;
                }
            }
        }
    }

    public function locateAyuda($pack, &$resp)
    {
        $itemsPack = array_diff(scandir($pack), array('.', '..'));
        foreach ($itemsPack as $value) {
            if (!is_file($pack . $value)) {
                $this->locateAyuda($pack . $value . '/', $resp);
            } else {
                $extension = pathinfo($pack . $value);
                if ($extension['extension'] == 'zip') {
                    $resp = $pack . $value;
                }
            }
        }
    }


    public function compararYcopiar($pack, $root)
    {
        $itemsPack = array_diff(scandir($pack), array('.', '..'));
        $itemsRoot = array_diff(scandir($root), array('.', '..'));
        $nuevos = array_diff($itemsPack, $itemsRoot);
        foreach ($nuevos as $key => $value) {
            shell_exec('cp -r ' . $pack . $value . ' ' . $root . $value);
        }
        $explore = array_diff($itemsPack, $nuevos);
        foreach ($explore as $value) {
            if (!is_file($pack . $value)) {
                $this->compararYcopiar(
                    $pack . $value . '/',
                    $root . $value . '/'
                );
            }
        }
    }

    /**
     * funcion para comprobar si una app esta instalada
     */
    public function controlarInstalado($namepaquete, $version)
    {
        $result = shell_exec(
            "cd " . dirname(__FILE__) . "/../../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
            "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer show -i"
        );
        $salida = nl2br($result);
        $salida = explode('<br />', $salida);
        foreach ($salida as $linea) {
            $lineaDividida = explode(" ", $linea);
            if ($lineaDividida[0] == $namepaquete && $lineaDividida[1] == $version
            ) {
                return true;
            }
        }

        return false;
    }

    public function controlarInstaladoDadoNombre($namepaquete)
    {
        $tmp = explode("_", $namepaquete);
        $name = $tmp[0];
        $version = $tmp[1];
        $result = shell_exec(
            "cd " . dirname(__FILE__) . "/../../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
            "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer show -i"
        );
        $salida = nl2br($result);
        $salida = explode('<br />', $salida);
        foreach ($salida as $linea) {
            $lineaDividida = explode(" ", $linea);
            if ($lineaDividida[0] == $name && $lineaDividida[1] == $version) {
                return true;
            }
        }

        return false;
    }

    public function getPaquetesInstalados()
    {
        $iniFile = parse_ini_file(
            __DIR__ . "/../../../../web/controlpanel/configuraciones/install.ini"
        );
        $paquetesInstalados = $iniFile['install'];

        return $paquetesInstalados;
    }

    /**
     * Metodo que actualiza el estado(Instalado-Actualizacion) de los paquetes
     */
    public function estadoYversion($listadoPaquetes)
    {
        $paquetesInstalados = $this->getPaquetesInstalados();
        $resulatadoLisPaquetes = array();
        foreach ($paquetesInstalados as $paqueteInstall) {
            $arrayTempInstal = explode('->', $paqueteInstall);
            $nombreInstall = $arrayTempInstal[0];
            $lisAux = $this->getArregloPaquetesDodoNombre(
                $listadoPaquetes,
                $nombreInstall
            );
            $versionInstall = $this->concatenarVersion($arrayTempInstal[1]);
            $idInstalado = $nombreInstall . '_' . $arrayTempInstal[1];
            $pos = $this->getPosMayorVersionPaquete($lisAux);
            if ($pos > -1) {
                if ($versionInstall < $this->concatenarVersion($lisAux[$pos]['version'])) {
                    for ($i = 0; $i < count($lisAux); $i++) {
                        if ((String)$lisAux[$i]['ID'] == $idInstalado) {
                            $lisAux[$i]['ESTADO'] = 'Desactualizado';
                        }
                        $lisAux[$i]['VERSIONINSTALADA'] = $arrayTempInstal[1];
                        array_push($resulatadoLisPaquetes, $lisAux[$i]);
                    }
                } else {
                    for ($i = 0; $i < count($lisAux); $i++) {
                        if ((String)$lisAux[$i]['ID'] == $idInstalado) {
                            $lisAux[$i]['ESTADO'] = 'Instalado';
                        }
                        $lisAux[$i]['VERSIONINSTALADA'] = $arrayTempInstal[1];
                        array_push($resulatadoLisPaquetes, $lisAux[$i]);
                    }
                }
            }
        }
        $resultadoFinal = $this->joinListaDePaquetes(
            $resulatadoLisPaquetes,
            $listadoPaquetes
        );

        return (count($resulatadoLisPaquetes) > 0) ? $resultadoFinal : $listadoPaquetes;
    }

    public function devolverPaqueteDeVersionMayor($idPaquete)
    {
        $arrayIdPaquetes = explode(', ', $idPaquete);
        $pack = $arrayIdPaquetes[0];
        $details = explode('(', $pack);
        $name = $details[0];
        $details = explode(')', $details[1]);
        $result = shell_exec(
            "cd " . dirname(__FILE__) . "/../../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
            "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer install --dry-run"
        );
        $resp = array();

        return false;
    }

    private function joinListaDePaquetes($listaIntall, $listaPaquetes)
    {
        $result = array();
        $band = false;
        foreach ($listaPaquetes as $version) {
            foreach ($version as $paquete) {
                $band = false;
                $idPaquete = $paquete['name'] . "_" . $paquete['version'];
                for ($indexo = 0; $indexo < count($listaIntall); $indexo++) {
                    $idInstal = $listaIntall[$indexo]['ID'];
                    if ($idPaquete == $idInstal) {
                        $band = true;
                    }
                }
                if (!$band) {
                    array_push($result, $paquete);
                }
            }
        }
        foreach ($result as $paquete) {
            array_push($listaIntall, $paquete);
        }

        return $listaIntall;
    }

    private function getArregloPaquetesDodoNombre($listadoPaquetes, $nombre)
    {
        $listadoresult = array();
        foreach ($listadoPaquetes as $paquete) {
            foreach ($paquete as $value) {
                if ((String)$value['name'] == $nombre) {
                    array_push($listadoresult, $value);
                }
            }
        }

        return $listadoresult;
    }

    private function getPosMayorVersionPaquete($lisAux)
    {
        $mayorversionInstall = '0';
        $pos = -1;
        for ($i = 0; $i < count($lisAux); $i++) {
            if ($this->concatenarVersion($lisAux[$i]['version']) > $mayorversionInstall
            ) {
                $mayorversionInstall = $this->concatenarVersion(
                    $lisAux[$i]['version']
                );
                $pos = $i;
            }
        }

        return $pos;
    }

    /**
     * Corre los script de la base de datos
     */
    public function runBD($host, $puerto, $dbname, $user, $pass, $direccion, $action = false, $versions = array())
    {
        //if ($action == 'uninstall') {
        if (!extension_loaded('quarseg')) {
            $conexionbd = new PDO(
                "pgsql:host=$host;dbname=$dbname;port=$puerto", $user, $pass
            );
        } else {
            Quarseg\Database\Connection::getInstance($this, __FILE__)
                ->getConnection(
                    $host,
                    $puerto,
                    "pgsql",
                    $dbname,
                    null,
                    $user
                );
            $conexionbd = $this->currentPdoConn;
        }
        /* } else {
             $conexionbd = new PDO(
                 "pgsql:host=$host;dbname=$dbname;port=$puerto", $user, $pass
             );
         }*/
        $config = new Zend_Config_Ini($direccion); // carga los sql
        $sql = "BEGIN TRANSACTION;";
        $tmp = "";
        $util = new UtilControlPanel();
        foreach ($config as $key => $array) {
            foreach ($array as $value) {
                $version = $util->getVersionByNameSql(basename($value));
                switch ($action) {
                    case 'update':
                        if ($version >= $versions['inferior'] && $version <= $versions['superior']
                        ) {
                            $tmp .= file_get_contents(
                                dirname($direccion) . $value
                            );
                        }
                        break;
                    case 'revert':
                        if ($version < $versions['inferior'] && $version >= $versions['superior']
                        ) {
                            $tmp .= file_get_contents(
                                dirname($direccion) . $value
                            );
                        }
                        break;
                    case 'uninstall':
                        $tmp .= file_get_contents(dirname($direccion) . $value);
                        break;
                    default:
                        $tmp .= file_get_contents(dirname($direccion) . $value);
                }
            }
        }
        $sql .= $tmp;
        $sql .= "ROLLBACK TRANSACTION;";
        $conexionbd->exec($sql);
        $error = $conexionbd->errorInfo();
        if (count($error) > 1 && isset($error[2])) {
            //return false;
            return  array('succes' => false, 'error' => $error);
        }
        $conexionbd->exec($tmp);
        try {
            /*Correr scrip de seguridad*/
            $fileScript = dirname(__FILE__) . '/../../comun/recursos/script/ScriptTriggerSeguridad.sql';
            $fileQuery = dirname(__FILE__) . '/../../comun/recursos/script/query.sql';
            $dirSeguridadJson = dirname(__FILE__) . '/../../../../apps/comun/database.hash';
            $arrayBataBase = json_decode(
                file_get_contents($dirSeguridadJson),
                true
            );
            if (file_exists($fileScript) && file_exists($fileQuery)) {
                $contenido = file_get_contents($fileScript);
                $conexionbd->exec($contenido);
                $contenido = file_get_contents($fileQuery);
                $hash = "";
                foreach ($conexionbd->query($contenido) as $tupla) {
                    $hash .= $tupla['oidhash'];
                }
                $hash = sha1($hash);
                $arrayBataBase[$dbname] = $hash;
                file_put_contents(
                    $dirSeguridadJson,
                    json_encode($arrayBataBase)
                );
            }
        } catch (Exception $e) {
            throw new Exception(
                "Ocurrio un error al ejecutar los script de seguridad de la base de datos"
            );
        }

        //return true;
        return  array('succes' => true);
    }

    public function concatenarVersion($version)
    {
        $versionPaquete = explode('.', $version);

        return $versionPaquete[0] . $versionPaquete[1] . $versionPaquete[2];
    }

    public function isTarGzFile($name)
    {
        $tmpArreglo = explode('.', $name);
        $length = count($tmpArreglo);

        return ($length >= 3 && $tmpArreglo[$length - 1] == 'gz' && $tmpArreglo[$length - 2] == 'tar');
    }

    public function isCorrectoPaquete($arregloRutas, $nombre)
    {
        $length = count($arregloRutas);
        if ($length >= 3) {
            $apps = $nombre . '/apps/' . $nombre . '/';
            $web = $nombre . '/web/' . $nombre . '/';
            $contador = 0;
            for ($i = 0; $i < $length; $i++) {
                if ($this->compararRutas($web, (String)$arregloRutas[$i]) ||
                    $this->compararRutas($apps, (String)$arregloRutas[$i])
                ) {
                    $contador++;
                }
            }
            if ($contador == $length - 3) {
                return true;
            }
        }

        return false;
    }

    public function compararRutas($rutainic, $rutafin)
    {
        $length = strlen($rutainic);
        $lengthfin = strlen($rutafin);
        if ($length <= $lengthfin) {
            for ($i = 0; $i < $length; $i++) {
                if ($rutainic[$i] != $rutafin[$i]) {
                    return false;
                }
            }
        } else {
            return false;
        }

        return true;
    }

    public function actualizarEstadoXML($estado, $id)
    {
        $xmldir = dirname(__FILE__) . '/../../../../web/controlpanel/repo/components.json';
        $strDatos = file_get_contents($xmldir);
        $datos = json_decode($strDatos, true);
        $packages = $datos["PAQUETES"];
        $pos = 0;
        $id = -1;
        foreach ($packages as $pakage) {
            if ((String)$pakage['ID'] == $id) {
                $id = $pos;
                break;
            }
            $pos++;
        }
        $packages[$id]['ESTADO'] = $estado;
        $fh = fopen($this->fileNameJson, 'w');
        fwrite($fh, json_encode($packages));
        fclose($fh);
    }

    public function obtenerNodoRaiz($arregloRutas)
    {
        if (count($arregloRutas) > 1) {
            $raiz = explode('/', $arregloRutas[0]);

            return $raiz[0];
        }

        return false;
    }

    public function actualizarPaquete($idPaquete, $versionToInstall = null)
    {
        chmod(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/Install",
            0777
        );
        $idPaquete = explode('_', $idPaquete);
        $name = $idPaquete[0];
        $version = $idPaquete[1];
        if ($versionToInstall == null) {
            $versionToInstall = $this->buscarVersionSuperiorCercana($name);
        }
        $originalContent = file_get_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/Install/composer/installed.json"
        );
        $jobs = json_decode(
            file_get_contents(
                dirname(__FILE__) . "/../../../../web/controlpanel/repo/trash/jobs.json"
            ),
            true
        );
        $tmp = json_decode($originalContent, true);
        //quita el codigo fuente
        foreach ($tmp as $paquete) {
            if ($paquete['name'] == $name && $paquete['version'] == $version) {
                foreach ($paquete['extra'] as $key => $value) {
                    if (isset($value['install'])) {
                        foreach ($value['install'] as $folder) {
                            $id = time();
                            array_push(
                                $jobs['deleted'][$id],
                                dirname(__FILE__) . "/../../../../" . $folder['target']
                            );
                            shell_exec(
                                'mv ' . dirname(__FILE__) . "/../../../../" . $folder['target'] . " " .
                                dirname(__FILE__) . "/../../../../web/controlpanel/repo/trash/$id"
                            );
                        }
                    }
                }
            }
        }
        file_put_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json",
            json_encode($jobs)
        );
        //obtengo el contenido del fichero con el paquete
        $content = file_get_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json"
        );
        $temp = json_decode($content, true);
        if (isset($temp['require'][$name]) && $temp['require'][$name] == "$version"
        ) {
            unset($temp['require'][$name]);
            unlink(
                dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.lock"
            );
            file_put_contents(
                dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json",
                json_encode($temp)
            );
            $cmd = "cd " . dirname(__FILE__) . "/../../../../web/controlpanel/repo/;"
                . "COMPOSER_HOME=./.composer "
                ."php ../../../apps/controlpanel/comun/recursos/composer/bin/composerinstall";
            shell_exec($cmd);
        }
        $temp['require'][$name] = $versionToInstall;
        file_put_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json",
            json_encode($temp)
        );
        unlink(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.lock"
        );
        $cmd = "cd " . dirname(__FILE__) . "/../../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
            "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer update $name";
        shell_exec($cmd);

        return true;
    }

    public function buscarVersionSuperiorCercana($name)
    {
        $cmd = "cd " . dirname(__FILE__) . "/../../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer "
            . "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer show $name";
        $resultado = shell_exec($cmd);
        $dividido = explode('requires', $resultado);
        $info = nl2br($dividido[0]);
        $info = explode('<br />', $info);
        $anterior = '';
        foreach ($info as $tupla) {
            $div = explode(':', $tupla);
            $div[0] = rtrim(ltrim($div[0]));
            $div[1] = rtrim(ltrim($div[1]));
            switch ($div[0]) {
                case 'versions':
                    $versions = explode(', ', $div[1]);
                    $anterior = $versions[0];
                    break;
                default:
                    break;
            }
        }

        return $anterior;
    }

    public function desintalarPaquete($idPaquete, $deleDatos = false)
    {
        $idPaquete = explode('(', $idPaquete);
        $name = str_replace('-','',$idPaquete[0]);
        $idPaquete = explode(')', $idPaquete[1]);
        $version = $idPaquete[0];

        $split = explode('-',$version);
        $pcero = ($split[1] == 'alfa') ? '7' : (($split[1] == 'beta') ? '8' : '9');
        $version = $pcero . $split[0];

        $originalContent = file_get_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/Install/composer/installed.json"
        );
        $tmp = json_decode($originalContent, true);
        $jobsContent = file_get_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/trash/jobs.json"
        );

        $jobs = json_decode($jobsContent, true);
        /*Correr los escrip para desinstalar*/
        $dirScript = "";
        if ($deleDatos == "true") {
            $util = new UtilControlPanel();
            $arrays = $util->getElement();
            $dir = $arrays['packages'][$name]['dir_packages'];
            $element = $this->getElementPackage($name, $version);
            $dirScript = $element['extra']['script']['uninstall'][0];
            $nameSubSystem = $element['subsystem'];
            $arrayDatos = $this->getDateConecctionBySubSystem($nameSubSystem);

            $respuestaBD = $this->runBD(
                $arrayDatos['host'],
                $arrayDatos['port'],
                $arrayDatos['bd'],
                $arrayDatos['usuario'],
                $arrayDatos['password'],
                $dir . $dirScript,
                'uninstall'
            );
            if ($respuestaBD == false) {
                return false;
            }
        }
        /*FIN*/
        foreach ($tmp as $paquete) {
            if ($paquete['name'] == $name && $paquete['version'] == $version) {
                foreach ($paquete['extra']['install'] as $key => $value) {
                    foreach ($value as $keyUno => $folder) {
                        if ($keyUno == 'source') {

                            $id = rand();
                            $cmd = 'mv ' . dirname(__FILE__) . "/../../../../" . $folder . " " . dirname(__FILE__) .
                                "/../../../../web/controlpanel/repo/trash/$id/ 2>&1";

                            shell_exec($cmd);

                            //todo: cable para replica uninstall
                            if($folder == 'apps/replica'){
                                $dirnode = 'apps/replica_nodejs';
                                $id = rand();
                                $cmd2 = 'mv ' . dirname(__FILE__) . "/../../../../" . $dirnode . " " . dirname(__FILE__) .
                                    "/../../../../web/controlpanel/repo/trash/$id/ 2>&1";
                                shell_exec($cmd2);
                            }
                            array_push(
                                $jobs['files'],
                                "mv " . dirname(__FILE__) . "/../../../../web/controlpanel/repo/trash/$id/ " .
                                dirname(__FILE__) . "/../../../../" . $folder
                            );
                            if (file_exists(
                                dirname(__FILE__) . "/../../../../" . $folder
                            )) {
                                file_put_contents(
                                    dirname(__FILE__) . "/../../../../web/controlpanel/repo/trash/jobs.json",
                                    json_encode($jobs)
                                );

                                return false;
                            }
                        }
                    }
                }
            }
        }
        $tmpArray = $this->getIdSistemasYIdAyuda($name);
        if (isset($tmpArray['sistema']) && $tmpArray['sistema'] != false && $tmpArray['sistema'] != null
        ) {
            ZendExt_IoC::getInstance()->seguridad->eliminarSistema(
                $tmpArray['sistema']
            );
        }
        if (isset($tmpArray['xml']) && $tmpArray['xml'] != false && $tmpArray['xml'] != null
        ) {
            ZendExt_IoC::getInstance()->seguridad->eliminarSubsistemasXml(
                $tmpArray['xml']
            );
        }
        file_put_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/trash/jobs.json",
            json_encode($jobs)
        );

        return true;
    }

    public function reinstalarPaquete($name, $version, $opcion)
    {
        $originalContent = file_get_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/Install/composer/installed.json"
        );
        $tmp = json_decode($originalContent, true);
        $jobsContent = file_get_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/trash/jobs.json"
        );
        $jobs = json_decode($jobsContent, true);
        foreach ($tmp as $paquete) {
            if ($paquete['name'] == $name && $paquete['version'] == $version) {
                foreach ($paquete['extra'] as $key => $value) {
                    if (isset($value['install'])) {
                        foreach ($value['install'] as $folder) {
                            $id = rand();
                            shell_exec(
                                'mv ' . dirname(__FILE__) . "/../../../../" . $folder['target'] . " " .
                                dirname(__FILE__) . "/../../../../web/controlpanel/repo/
                              trash/$id/ 2>&1"
                            );
                            array_push(
                                $jobs['files'],
                                "mv " . dirname(__FILE__) . "/../../../../web/controlpanel/repo/trash/$id/ " .
                                dirname(__FILE__) . "/../../../../" . $folder['target']
                            );
                        }
                    }
                }
            }
        }
        unlink(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.lock"
        );
        shell_exec(
            'rm -R ' . dirname(__FILE__) . "/../../../../web/controlpanel/repo/Install/" . $name
        );
        $result = shell_exec(
            "cd " . dirname(__FILE__) . "/../../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
            "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer install"
        );
        $install = explode("<--", $result);
        $resp = array();
        for ($index = 1; $index < count($install); $index++) {
            $tmp = explode('-->', $install[$index]);
            array_push($resp, $tmp[0]);
        }
        file_put_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/trash/jobs.json",
            json_encode($jobs)
        );

        return $this->instalarPaquete(
            $resp[0],
            true,
            null,
            $opcion,
            'reinstall'
        );
    }

    public function getCnx($name, $version, $opcional =  null){

        $originalContent = file_get_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json"
        );
        $temp = json_decode($originalContent, true);

        foreach ($temp['repositories'] as $value) {
            if (isset($value['url'])) {
                $repoContent = file_get_contents(
                    $value['url'] . "packages.json",
                    null,
                    $this->getContextOptions()
                );
                $repo = json_decode($repoContent, true);

                foreach ($repo['packages'] as $key => $val) {

                    if($key == $name){

                        if ($val[$version]['extra']['script']) {
                            $string = $val[$version]['extra']['script']['install'];
                            if(strlen($string[0]) != 0){
                                return true;
                            }elseif(isset($opcional)){
                                return false;

                            }elseif(count($val[$version]['require']) != 0){

                                $requires = $val[$version]['require'];
                                foreach ($requires as $name => $require){

                                    $require = str_replace('=','',$require);
                                    return $this->getCnx($name, $require);
                                }
                            }
                        }
                    }
                }
            }
        }

    }

    public function getCambios($idPaquete, $action = 'update')
    {
        $conexion = 0;
        $tmp = explode('_', $idPaquete);
        $name = $tmp[0];

        $version = $tmp[1];
        $originalContent = file_get_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json"
        );
        $temp = json_decode($originalContent, true);
        $temp['require'][$name] = ($action == 'update') ? "*" : $version;

        unlink(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.lock"
        );
        file_put_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json",
            json_encode($temp)
        );

        $cmd = "cd " . dirname(__FILE__) . "/../../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer "
            . "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer $action --dry-run";
        $result = shell_exec($cmd);
        file_put_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json",
            $originalContent
        );
        $result = nl2br($result);
        $result = str_replace(
            "Loading composer repositories with package information<br />",
            "",
            $result
        );
        $result = str_replace(
            "Updating dependencies (including require-dev)<br />",
            "",
            $result
        );
        $result = str_replace(
            "Installing dependencies (including require-dev)<br />",
            "",
            $result
        );
        $result = trim($result);
        $result = str_replace("Updating", "Se actualizará", $result);
        $result = str_replace("Installing", "Se instalará", $result);
        $result = str_replace("Removing", "Se desinstalará", $result);
        $result = str_replace("Uninstalling", "Se desinstalará", $result);
        //$result = str_replace("to", "a", $result);
        $result = str_replace("<br />", '', $result);
        $result = str_replace("-", '<br />-', $result);
        $result = ltrim($result);
        $lineas = explode('-', $result);

        foreach ($lineas as $linea) {
            if (strpos($linea, "instalará") !== false ){
                $typeV = explode(' ', $linea);
                $v1 = str_replace('(', '',$typeV[4]);
                $v1 = str_replace(')', '',$v1);
                $v1 = str_replace("\n", '',$v1);

            }elseif(strpos($linea, "actualizará") !== false ){

                $typeV = explode(' ', $linea);
                $v1 = str_replace('(', '',$typeV[7]);
                $v1 = str_replace(')', '',$v1);
                $v1 = str_replace("\n", '',$v1);

            }

        }

        /*$temp = json_decode($originalContent, true);
        foreach ($temp['repositories'] as $value) {
            if (isset($value['url'])) {
                $repoContent = file_get_contents(
                    $value['url'] . "packages.json"
                );
                $repo = json_decode($repoContent, true);

                foreach ($repo['packages'] as $key => $val) {
                    if($key == $name){

                        if ($val[$v1]['extra']['script']) {
                            $string = $val[$v1]['extra']['script']['install'];
                            if(strlen($string[0]) != 0){

                                $conexion = true;
                                break;
                            }
                        }
                    }
                }
            }
        }*/

        $conexion = $this->getCnx($name,$v1);

        $resp = array($conexion, $result);

        return $resp;
    }

    public function paquetesDesintalar($idPaquete)
    {
        $tmp = explode('_', $idPaquete);
        $name = $tmp[0];
        $version = $tmp[1];
        $originalContent = file_get_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json"
        );
        $temp = json_decode($originalContent, true);
        if (isset($temp['require'][$name]) && $temp['require'][$name] == "$version"
        ) {
            unset($temp['require'][$name]);
            if (count($temp['require']) == 0) {
                unset($temp['require']);
            }
            unlink(
                dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.lock"
            );
            file_put_contents(
                dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json",
                json_encode($temp)
            );
            $result = shell_exec(
                "cd " . dirname(__FILE__) . "/../../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
                "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer install --dry-run"
            );
            $arreglo = explode('- Uninstalling ', $result);
            $resp = array();
            for ($index = 1; $index < count($arreglo); $index++) {
                array_push($resp, trim($arreglo[$index]));
            }
            file_put_contents(
                dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json",
                $originalContent
            );
        }

        return $resp;
    }

    public function devolverNombrePaquteDescomprimido($repositoriosActivos, $id)
    {
        foreach ($repositoriosActivos as $paquetes) {
            foreach ($paquetes as $paquete) {
                if ((String)$paquete['ID'] == $id) {
                    return (String)$paquete['NAMEPAQUETE'];
                }
            }
        }

        return false;
    }

    public function getPaquetesXMLComponents()
    {
        $xmldir = dirname(__FILE__) . '/../../../../web/controlpanel/repo/components.json';
        $strDatos = file_get_contents($xmldir);
        $datos = json_decode($strDatos, true);
        $packages = $datos["PAQUETES"];

        return $packages;
    }

    public function getIDPaquetesInstaladoVesionMenor($nombre, $version)
    {
        $paquetes = $this->getPaquetesXMLComponents();
        foreach ($paquetes as $paquete) {
            $paqVesion = $this->concatenarVersion((String)$paquete['VERSION']);
            $version = $this->concatenarVersion($version);
            if ((String)$paquete['ESTADO'] == "Instalado" && (String)$paquete['NAME'] == $nombre &&
                $paqVesion < $version
            ) {
                $this->actualizarEstadoXML("Desactualizado", $paquete['ID']);
            }
        }
    }

    public function listadoPaquetesInstalar($idPaquete)
    {
        $tmp = explode('_', $idPaquete);
        $name = $tmp[0];
        $version = $tmp[1];
        $originalContent = file_get_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json"
        );
        $temp = json_decode($originalContent, true);
        if (isset($temp['require'])) {
            $temp['require'][$name] = "$version";
        } else {
            $temp['require'] = array();
            $temp['require'][$name] = "$version";
        }
        unlink(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.lock"
        );
        chmod(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json",
            0777
        );
        file_put_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json",
            json_encode($temp)
        );
        $result = shell_exec(
            "cd " . dirname(__FILE__) . "/../../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
            "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer install --dry-run"
        );
        $resp = array();
        if (strpos($result, 'Problema')) {
            $result = explode('requires', $result);
            $result = implode('requiere', $result);
            $salida = nl2br($result);
            $salida = explode('<br />', $salida);
            unset($salida[0]);
            unset($salida[1]);
            $message = $salida[2];
            unset($salida[2]);
            $salida = implode('<br />', $salida);
            array_push($resp, 0);
            array_push($resp, $message);
            array_push($resp, $salida);
            file_put_contents(
                dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json",
                $originalContent
            );
        } else {
            $paquetesPorInstalar = explode('- Installing ', $result);
            file_put_contents(
                dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json",
                $originalContent
            );
            for ($index = 1; $index < count($paquetesPorInstalar); $index++) {
                $data = explode(' ', $paquetesPorInstalar[$index]);
                array_push($resp, $data[0] . $data[1]);
            }
        }

        return $resp;
    }

    public function instalarPaquete(
        $paquete,
        $noConection,
        $datosConection = array(),
        $opcion = false,
        $action = false,
        $version = array(),
        $arraysTmp = array(),
        $flag
    )
    {
        $itemsSignature = array_diff(scandir($paquete), array('.', '..'));
        $zip = '';
        foreach ($itemsSignature as $value) {
            if ($value != 'signature.sig') {
                $zip = $value;
            }
        }
        $itemsPack = array_diff(
            scandir(
                dirname(__FILE__) . '/../../../../web/controlpanel/repo/clavesPublicas/'
            ),
            array('.', '..', '.svn')
        );
        $resp = false;
        /*preguntarle a almarales para que es esta verificacion */
        foreach ($itemsPack as $value) {
            $cmd = "cd " . dirname(__FILE__) . "/../../../../web/controlpanel/repo/clavesPublicas/;" .
                "openssl x509 -pubkey -in $value -noout > mypubkey.pem;"
                . "openssl dgst -sha1 -verify mypubkey.pem -signature $paquete/signature.sig $paquete/$zip;";
            $result = shell_exec($cmd);
            $cmd = "rm " . dirname(__FILE__) . "/../../../../web/controlpanel/repo/clavesPublicas/mypubkey.pem";
            shell_exec($cmd);
            if (stripos($result, 'erified OK') != false) {
                $resp = true;
                break;
            }
        }
        if ($resp) {
            $realcnx = str_replace('_','',$zip);
            $v1 = explode('.',$realcnx);
            $name = 'xetid/'.substr($v1[0], 0,-2);

            $v2 = substr($v1[0],-2) .'.'. $v1[1] .'.'. $v1[2];

            //$v2 = explode('.',$v1[1]);

            $cadena = ereg_replace("(alfa|beta|rc)", "", $v1[3]);
            $v2 = $v2 .'.'.$cadena;

            $result = chmod($paquete, 0777);
            $result = chmod($paquete / $zip, 0777);
            $result = chmod("$paquete/signature.sig", 0777);
            $result = shell_exec("cd $paquete;unzip $zip");
            $result = explode('creating: ', $result);

            //$noConection =  ($this->getCnx($name, $v2, true)) ? 'true' : 'false';

            $result = explode('/', $result[1]);
            $carpeta = $result[0];
            unlink("$paquete/signature.sig");
            unlink($paquete . '/' . $zip);

            if ($noConection == 'true') {
                // if ($realcnx) {
                return $result = $this->instalarPaqueteSinConexion(
                    $paquete . '/' . $carpeta,
                    $opcion,
                    $action
                );
            } else {
                return $result = $this->instalarPaqueteConConexion(
                    $paquete . '/' . $carpeta,
                    $opcion,
                    $datosConection,
                    $action,
                    $version,
                    $arraysTmp,
                    $flag
                );
            }
        } else {
            $result = false;
            $message = 'No se pudieron comprobar las firmas de todos los paquetes.';
            throw new Exception($message);
        }

        return $result;
    }

    public function instalarPaqueteSinConexion(
        $paquete,
        $opcion = false,
        $action = false,
        $conections = array()
    )
    {
        $jobsContent = file_get_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/trash/jobs.json"
        );
        $jobs = json_decode($jobsContent, true);
        $originalContent = file_get_contents($paquete . "/composer.json", null, $this->getContextOptions());
        $detalles = json_decode($originalContent, true);
        $nombrePaquete = $detalles['name'];
        $versionPaquete = $detalles['version'];
        foreach ($detalles['extra'] as $key => $value) {
            if ($key == 'install') {
                foreach ($value as $file) {
                    $cmd = 'cp -r ' . $paquete . "/" . $file['source'] . ' ' . dirname(__FILE__) . '/../../../../' .
                        $file['target'];
                    shell_exec($cmd);

                    //todo: cable para replica install
                    if($file['source'] == 'apps/replica'){
                        $dirnode = 'apps/replica_nodejs';
                        $cmd = 'cp -r ' . $paquete . "/" . $dirnode . ' ' . dirname(__FILE__) . '/../../../../' .
                            $file['target'];
                        shell_exec($cmd);
                    }
                }
            }
        }
        file_put_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/trash/jobs.json",
            json_encode($jobs)
        );
        $idSistema = "";
        $seguridad = false;
        $ayuda = false;
        if ($action == 'update' || $action == 'revert' || $action == 'reinstall'
        ) {
            $tmpArray = $this->getIdSistemasYIdAyuda($nombrePaquete);
            if (isset($tmpArray['sistema']) && $tmpArray['sistema'] != false && $tmpArray['sistema'] != null
            ) {
                ZendExt_IoC::getInstance()->seguridad->eliminarSistema(
                    $tmpArray['sistema']
                );
            }
            if (isset($tmpArray['xml']) && $tmpArray['xml'] != false && $tmpArray['xml'] != null
            ) {
                ZendExt_IoC::getInstance()->seguridad->eliminarSubsistemasXml(
                    $tmpArray['xml']
                );
            }
        }
        foreach ($detalles['extra'] as $key => $value) {
            if ($key == 'sistema') {
                $seguridad = $value[0];
                break;
            }
        }
        foreach ($detalles['extra'] as $key => $value) {
            if ($key == 'ayuda') {
                $ayuda = $value[0];
                break;
            }
        }
        if ($seguridad) {
            $xmlContent = file_get_contents($paquete . $seguridad, null, $this->getContextOptions());
            $xmlContent = trim($xmlContent);
            $xmlSistema = simplexml_load_string($xmlContent);
            if ($xmlSistema) {
                $idSistema = ZendExt_IoC::getInstance()->seguridad->importarXMLSistema($xmlSistema);
            }
        }
        if ($ayuda) {
            ZendExt_IoC::getInstance()->zeolhelp->importarProyecto(
                $paquete . $ayuda
            );
        }
        $element = $this->getElementPackage($nombrePaquete, $versionPaquete);
        $idxml = time();
        $this->integrator->seguridad->publicarSubsistemasXml(
            $idxml,
            $element['subsystem'],
            $element['subsystem'],
            $element['nameProduct']
        );
        if ($action != 'revert' && $action != 'reinstall') {
            $this->_util->push($nombrePaquete, $versionPaquete);
        }
        $this->insertarIdSistemasYIdAyuda($nombrePaquete, $idSistema, $idxml);
        if (count($conections) > 0) {
            $this->cambiarNombreBaseDatoXMLModilesConfig(
                $element['subsystem'],
                $conections
            );
        }
        $config = Zend_Registry::getInstance()->config;
        if ($opcion) {
            $dirAppsSub = $config->dir_aplication . $element['subsystem'];
            //$dirWebSub =  $config->dir_webaplication.$element['subsystem'];
            // $this->ofuscarPhp($dirWebSub);
            $this->ofuscarPhp($dirAppsSub);
        }
        /*Limpiar cache del Marco de trabajo*/
        $_util = new UtilControlPanel();
        $_util->clearCacheMT();
        $arrays = $_util->getElement();
        $arrays['packages'][$nombrePaquete]['dir_packages'] = $paquete;
        $_util->setElement($arrays);

        //shell_exec("rm -R $paquete");

        /**Creando modulesconfig**/
        $rsa = new ZendExt_RSA_Facade();
        $subSystem = $element['subsystem'];
        $comun = 'comun/recursos/xml/modulesconfig.xml';
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirmoduleconfig = $dirApps . "$subSystem/$comun";
        $arrays = array();

        $bd = $conections['dbname'];
        $host = $conections['host'];
        $user = $conections['user'];
        $pass = $rsa->encrypt($conections['pass']);
        $puerto = $conections['puerto'];


        if (!file_exists($dirmoduleconfig)) {
            $copy = "<?xml version='1.0'?>
                     <config>
                     <conn bd='{$bd}' gestor='pgsql' host='{$host}' usuario='{$user}'
                     password='{$pass}'
                     port='{$puerto}'/>
                     </config>";

            file_put_contents($dirmoduleconfig, $copy);

        }
        /**Creando modulesconfig**/

       // return $arrays;

        return true;
    }

    private function insertarIdSistemasYIdAyuda(
        $namePacket,
        $idSistema = null,
        $idxml = null
    )
    {
        $dirInstalledJson = dirname(__FILE__) . '/../../comun/recursos/';
        shell_exec("chmod -R 777 $dirInstalledJson");
        $dirInstalledJson .= '/json/pila.json';
        $contenido = file_get_contents($dirInstalledJson);
        $datosInstalled = json_decode($contenido, true);
        $datosInstalled['packages'][$namePacket]['idelement'] = array("idSistema" => $idSistema, "idXml" => $idxml);;
        file_put_contents($dirInstalledJson, json_encode($datosInstalled));
    }

    private function getIdSistemasYIdAyuda($namePacket)
    {
        $dirInstalledJson = dirname(__FILE__) . '/../../comun/recursos/';
        shell_exec("chmod -R 777 $dirInstalledJson");
        $dirInstalledJson .= '/json/pila.json';
        $contenido = file_get_contents($dirInstalledJson);
        $datosInstalled = json_decode($contenido, true);
        $idSistema = $datosInstalled['packages'][$namePacket]['idelement']['idSistema'];
        $idxml = $datosInstalled['packages'][$namePacket]['idelement']['idXml'];

        return array(
            "sistema" => $idSistema,
            "xml" => $idxml,
        );
    }

    private function getPosPacketInstall(
        $datosInstalled,
        $namePacket,
        $versionPacket
    )
    {
        $length = count($datosInstalled);
        for ($i = 0; $i < $length; $i++) {
            if ($datosInstalled[$i]['name'] == $namePacket && $datosInstalled[$i]['version'] == $versionPacket
            ) {
                return $i;
            }
        }

        return -1;
    }

    public function deleteSchema(
        $paquete,
        $datosConection
    )
    {
        $result = false;
        $host = $datosConection['host'];
        $dbname = $datosConection['dbname'];
        $user = $datosConection['user'];
        $pass = $datosConection['pass'];
        $puerto = $datosConection['puerto'];

        try {
            if (!extension_loaded('quarseg')) {
                $conexion = new PDO(
                    "pgsql:host=$host;dbname=$dbname;port=$puerto", $user, $pass
                );
            } else {
                Quarseg\Database\Connection::getInstance($this, __FILE__)
                    ->getConnection(
                        $host,
                        $puerto,
                        "pgsql",
                        $dbname,
                        null,
                        $user
                    );
                $conexion = $this->currentPdoConn;
            }

        } catch (Exception $e) {
            $error = true;
            if(strstr($e->getMessage(), 'password')) {
                $result = false;
                throw new Exception(
                    'Ha ocurrido un error con la conexión a la base de datos debido a autentificación.'
                );
            }
            if(strstr($e->getMessage(), 'exist')) {
                $result = false;
                throw new Exception(
                    'Ha ocurrido un error con la conexión a la base de datos debido a que esta no existe.'
                );
            }
        }
        if (!$error) {
            $originalContent = file_get_contents($paquete . "/composer.json");
            $detalles = json_decode($originalContent, true);
            $script = false;

            foreach ($detalles['extra'] as $key => $value) {
                if ($key == 'script') {
                    foreach ($value as $keyUno => $val) {
                        if($keyUno == 'uninstall'){
                            $script = $val[0];
                        }
                    }
                }
            }
        }
        //$sql = "";
        $tmp = "";
        $config = new Zend_Config_Ini(($paquete) . $script); // carga los sql
        $util = new UtilControlPanel();

        foreach ($config as $key => $array) {
            foreach ($array as $value) {
                $version = $util->getVersionByNameSql(basename($value));
                $tmp .= file_get_contents(dirname($paquete . $script) . $value);
            }
        }

        //$tmp .= file_get_contents(dirname($paquete) . $script);

        //$sql .= $tmp;
       // $sql .= "ROLLBACK TRANSACTION;";

        $conexion->exec($tmp);
        $error = $conexion->errorInfo();
        if (count($error) > 1 && isset($error[2])) {
            //return false;
            return  array('succes' => false, 'error' => $error);
        }else{
            return  array('succes' => true);
        }

    }
    /**
     * @param $paquete
     * @param $opcion
     * @param $datosConection
     * @param bool $action
     * @param array $versions
     * @param array $arraysTmp
     * @param null $flag
     * @return bool|mixed
     * @throws Exception
     */
    public function instalarPaqueteConConexion(
        $paquete,
        $opcion,
        $datosConection,
        $action = false,
        $versions = array(),
        $arraysTmp = array(),
        $flag = null
    )
    {
        $result = false;
        $host = $datosConection['host'];
        $dbname = $datosConection['dbname'];
        $user = $datosConection['user'];
        $pass = $datosConection['pass'];
        $puerto = $datosConection['puerto'];
        try {
            if (!extension_loaded('quarseg')) {
                $conexion = new PDO(
                    "pgsql:host=$host;dbname=$dbname;port=$puerto", $user, $pass
                );
            } else {
                Quarseg\Database\Connection::getInstance($this, __FILE__)
                    ->getConnection(
                        $host,
                        $puerto,
                        "pgsql",
                        $dbname,
                        null,
                        $user
                    );
                $conexion = $this->currentPdoConn;
            }
            //$conexion = new PDO("pgsql:host=$host;port=$puerto", $user, $pass);

        } catch (Exception $e) {
            $error = true;
            if(strstr($e->getMessage(), 'password')) {
                $result = false;
                throw new Exception(
                    'Ha ocurrido un error con la conexión a la base de datos debido a autentificación.'
                );
            }
            if(strstr($e->getMessage(), 'exist')) {
                $result = false;
                throw new Exception(
                    'Ha ocurrido un error con la conexión a la base de datos debido a que esta no existe.'
                );
            }
        }
        if (!$error) {
            $originalContent = file_get_contents($paquete . "/composer.json");
            $detalles = json_decode($originalContent, true);
            $script = false;
            if ($action != 'revert') {
                foreach ($detalles['extra'] as $key => $value) {
                    if ($key == 'script') {
                        foreach ($value as $keyUno => $val) {
                            if ($keyUno == $action) {
                                $script = $val[0];
                            }elseif($flag == 'true' && $keyUno == 'uninstall'){
                                $scriptUnintall = $val[0];
                            }
                        }
                    }
                }
            } else {
                $directorioZip = dirname(__FILE__) . "/../../../../web/controlpanel/repo/trash/descarga/";
                $zipArchive = new ZipArchive();
                $result = $zipArchive->open(
                    $directorioZip . $arraysTmp['namezip']
                );
                if ($result === true) {
                    $zipArchive->extractTo(
                        $directorioZip . $arraysTmp['namezip'] . '-' . $versions['inferior']
                    );
                    $zipArchive->close();
                    $gestor = opendir(
                        $directorioZip . $arraysTmp['namezip'] . '-' . $versions['inferior']
                    );
                    if ($gestor) {
                        while ($entrada = readdir($gestor)) {
                            if (strpos($entrada, '.zip')) {
                                $zipArchive = new ZipArchive();
                                $dirPrueba =
                                    $directorioZip . $arraysTmp['namezip'] . '-' . $versions['inferior'] . "/" .
                                    $entrada;
                                $result = $zipArchive->open($dirPrueba);
                                if ($result === true) {
                                    $dirPruebaOne =
                                        $directorioZip . $arraysTmp['namezip'] . '-' . $versions['inferior'] . "A";
                                    $zipArchive->extractTo($dirPruebaOne);
                                    $zipArchive->close();
                                    $dirPruebaDos =
                                        $directorioZip . $arraysTmp['namezip'] . '-' . $versions['inferior'] . "A";
                                    if ($gestorDos = opendir($dirPruebaDos)
                                    ) {
                                        while ($entradaDos = readdir($gestorDos)) {
                                            if ($entradaDos != '.' && $entradaDos != '..') {
                                                $script = $directorioZip . $arraysTmp['namezip'] . '-' .
                                                    $versions['inferior'] . "A/" . $entradaDos .
                                                    "/data/script/revert.ini";
                                                closedir($gestorDos);
                                                break;
                                            }
                                        }
                                    }
                                }
                                break;
                            }
                        }
                        closedir($gestor);
                    }
                }
            }
            $dirScript = false;
            if ($script) {
                if ($action == 'revert') {
                    $temporal = file_exists($script);
                    $dirScript = $script;
                } else {
                    $temporal = file_exists($paquete . $script);
                    $dirScript = $paquete . $script;
                }
            } else {
                return $this->instalarPaqueteSinConexion(
                    $paquete,
                    $opcion,
                    $action
                );
            }
            if ($temporal) {
                if (!extension_loaded('quarseg')) {
                    $conexion = new PDO(
                        "pgsql:host=$host;dbname=$dbname;port=$puerto", $user, $pass
                    );
                } else {
                    Quarseg\Database\Connection::getInstance($this, __FILE__)
                        ->getConnection(
                            $host,
                            $puerto,
                            "pgsql",
                            $dbname,
                            null,
                            $user
                        );
                    $conexion = $this->currentPdoConn;
                    if (is_null($conexion)) {
                        $result = false;
                        $message = 'Error al establecer la coneccion con el servidor de bases de datos';
                        throw new Exception($message);
                    }
                }
                $error = $conexion->errorInfo();

                if (count($error) > 1 && !isset($error[2])) {

                    proveAgain:$respuestaBD = $this->runBD(
                        $host,
                        $puerto,
                        $dbname,
                        $user,
                        $pass,
                        $dirScript,
                        $action,
                        $versions
                    );

                    if ($respuestaBD['succes'] == false) {
                        $result = false;
                        $error = str_replace('ERROR:', '',$respuestaBD['error']);
                        $code = $error[0];

                        if($flag == 'true'){
                            $request = $this->deleteSchema($paquete . $scriptUnintall, $datosConection);
                            if(!$request['succes']){
                                $result = false;
                                $message = 'Error al ejecutar script de desintalación.';
                                throw new Exception($message);
                                return $result;
                            }
                            goto proveAgain;

                        }

                        $message = 'Error al ejecutar los scripts de base de datos, ' . $error[2];
                        throw new Exception($message, $code);
                    }
                    if ($respuestaBD['succes'] == true) {

                        $result = $this->instalarPaqueteSinConexion(
                            $paquete,
                            $opcion,
                            $action,
                            $datosConection
                        );

                    }
                } else {
                    $result = false;
                    $message = 'Se ha generado el siguiente error: ' . $error[2];
                    throw new Exception($message);
                }
            } else {
                $result = false;
                $message = 'No se pudieron localizar los scripts de bases de datos.';
                throw new Exception($message);
            }
        } else {
            $result = false;
            throw new Exception(
                'La conexión a la base de datos no ha sido establecida.'
            );
        }

        return $result;
    }

    public function getListadoPaquetesRespositorioActivos()
    {
        $listadoPaquetes = array();
        $fileNameJson = dirname(__FILE__) . '/../../../../web/controlpanel/configuraciones/repo.json';
        $strDatos = file_get_contents($fileNameJson);
        $datos = json_decode($strDatos, true);
        if ($datos) {
            $local = (String)$datos['LOCAL'];
            if ($local == 1) {
                $listaPaquetes = $this->listarPaquetesRlocal(
                    dirname(__FILE__) . '/../../../../web/controlpanel/repo/packages.json'
                );
                array_push($listadoPaquetes, $listaPaquetes);
            }
            $repositorios = $datos["REPOSITORIOS"];
            foreach ($repositorios as $repositorio) {
                if ($repositorio['ACTIVE'] == 1 && $this->comprobarUrl($repositorio['DIR'])) {
                    $listaPaquetes = $this->getListadosPaquetesDadoRepositorio($listadoPaquetes, $repositorio);
                    array_push($listadoPaquetes, $listaPaquetes);
                }
            }

            return $listadoPaquetes;
        }

        return false;
    }

    public function getListadosPaquetesDadoRepositorio(
        $resulListaPaquete,
        $repositorio
    )
    {
        $lista = array();
        $fileNameJson = $repositorio['DIR'] . 'components.json';
        $strDatos = file_get_contents($fileNameJson);
        $datos = json_decode($strDatos, true);
        $paquetes = $datos["PAQUETES"];
        foreach ($paquetes as $paquete) {
            if (!$this->encontrarPaquete($resulListaPaquete, $paquete)) {
                array_push($lista, $paquete);
            }
        }

        return $lista;
    }

    public function isInstaladoPaqueteDadoIdPaquete($idPaquete)
    {
        $paquete = explode('_', $idPaquete);
        $result = $this->controlarInstalado($paquete[0], $paquete[1]);

        return $result;
    }

    public function getPaqueteDadoIdPaquete($listadoPaquetesRespositorioActivos, $idPaquete)
    {
        foreach ($listadoPaquetesRespositorioActivos as $paquetes) {
            foreach ($paquetes as $paquete) {
                if ((String)$paquete['ID'] == $idPaquete) {
                    return $paquete;
                }
            }
        }

        return false;
    }


    public function existeConexion($listadoPaquetesRespositorioActivos, $idPaquete)
    {
        $paqutes = $this->getPaqueteDadoIdPaquete(
            $listadoPaquetesRespositorioActivos,
            $idPaquete
        );

        return ((String)$paqutes['cnxBD'] == 'true');
    }

    public function formarVersion($version)
    {
        $nuevaVersion = "";
        $temArreglo = explode('.', $version);
        $length = count($temArreglo);
        if ($length == 1) {
            $nuevaVersion = $version . '.0.0';
        } else {
            if ($length == 2) {
                $nuevaVersion = $version . '.0';
            } else {
                $nuevaVersion = $version;
            }
        }

        return $nuevaVersion;
    }

    public function cambiarNombreBaseDatoXMLModilesConfig($subsistema, $parameterConextion = array())
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $direction = $dirApps . $subsistema . '/comun/recursos/xml/moduleconfig.xml';
        if (file_exists($direction)) {
            $xmlConfig = new SimpleXMLElement($direction, null, true);
            if ($xmlConfig) {
                $rsa = new ZendExt_RSA_Facade();
                $atribute = $xmlConfig->conn;
                $atribute['bd'] = $parameterConextion['dbname'];
                $atribute['port'] = $parameterConextion['puerto'];
                $atribute['usuario'] = $parameterConextion['user'];
                $atribute['host'] = $parameterConextion['host'];
                $atribute['password'] = $rsa->encrypt(
                    $parameterConextion['pass']
                );
                $xmlConfig->saveXML($direction);
            }
        }
    }

    public function procesarAcciones($acciones, $conexion = null, $opcion = null, $deleDatos = false)
    {
        $conection = false;
        if ($conexion) {
            $conection = true;
        }
        $listaAcciones = explode('-', $acciones);

        foreach ($listaAcciones as $accion) {
            if (strpos($accion, 'instalará') != 0) {
                $accion = explode(" ", $accion);
                $name = $accion[3];
                $version = str_replace('(', '', $accion[4]);
                $version = str_replace(')', '', $version);
                //if (isset($conexion)) {

                $this->installPackageCode(
                    rtrim($name),
                    rtrim($version),
                    isset($conexion) ? true : false,
                    $conexion,
                    'install',
                    $opcion
                );
                //}
            } elseif (strpos($accion, 'actualizará') != 0) {

                $accion = explode(" ", $accion);

                $nameUno = $accion[3];

                $versionUno = str_replace('(', '', $accion[4]);
                $versionUno = str_replace(')', '', $versionUno);
                $nameDos = $accion[6];
                $versionDos = str_replace('(', '', $accion[7]);
                $versionDos = str_replace(')', '', $versionDos);

                if ($versionUno > $versionDos) {
                    $this->updatePackageCode(
                        rtrim($nameUno),
                        rtrim($versionUno),
                        rtrim($nameDos),
                        rtrim($versionDos),
                        $conection,
                        $conexion,
                        'revert',
                        $opcion
                    );
                } else {
                    $this->updatePackageCode(
                        rtrim($nameUno),
                        rtrim($versionUno),
                        rtrim($nameDos),
                        rtrim($versionDos),
                        $conection,
                        $conexion,
                        'update',
                        $opcion
                    );
                }
            } elseif (strpos($accion, 'eliminará') != 0) {
                $accion = explode(" ", $accion);
                $name = $accion[3];
                $version = str_replace('(', '', $accion[4]);
                $version = str_replace(')', '', $version);
                $this->desintalarPaquete($name . "_" . $version, $deleDatos);
            }
        }
    }

    public function installPackageCode($name, $version, $isConected = false, $conexion = null, $action = false,
                                       $opcion = null
    )
    {

        $originalContent = file_get_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json"
        );
        $temp = json_decode($originalContent, true);
        if (isset($temp['require'])) {
            $temp['require'][$name] = "$version";
        } else {
            $temp['require'] = array();
            $temp['require'][$name] = "$version";
        }
        file_put_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json",
            json_encode($temp)
        );
        unlink(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.lock"
        );
        $result = shell_exec(
            "cd " . dirname(__FILE__) . "/../../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
            "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer install"
        );
        $install = explode("<--", $result);
        $resp = '';
        for ($index = 1; $index < count($install); $index++) {
            $tmp = explode('-->', $install[$index]);
            $resp = $tmp[0];
        }
        $this->instalarPaquete(
            $resp,
            !$isConected,
            $conexion,
            $opcion,
            $action
        );
        file_put_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json",
            $originalContent
        );
        unlink(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.lock"
        );
        shell_exec(
            "cd " . dirname(__FILE__) . "/../../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
            "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer install"
        );
    }

    public function updatePackageCode(
        $name,
        $version,
        $newName,
        $newVersion,
        $isConected = false,
        $conection = null,
        $action = false,
        $opcion = null
    )
    {
        $versions = array(
            "inferior" => $version,
            "superior" => $newVersion
        );
        $originalContent = file_get_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/Install/composer/installed.json"
        );
        $tmp = json_decode($originalContent, true);

        foreach ($tmp as $paquete) {
            if ($paquete['name'] == $name && $paquete['version'] == $version) {

                //var_dump($paquete['extra']['install']);

                foreach ($paquete['extra']['install'] as $key => $value) {
                    //if (isset($value['install'])) {
                    //foreach ($value['install'] as $folder) {
                    //print_r('rm -R ' . dirname(__FILE__) . "/../../../../" . $value['source']);

                    shell_exec(
                        'rm -R ' . dirname(__FILE__) . "/../../../../" . $value['source']
                    );
                    // }
                    //  }
                }
            }
        }
        $originalContent = file_get_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json"
        );
        $temp = json_decode($originalContent, true);
        if (isset($temp['require'][$name])) {
            unset($temp['require'][$name]);
            $temp['require'][$newName] = "$newVersion";
        }
        if ($action == 'revert') {
            $namezip = $this->copyZipHttp($name, $version);
            if ($namezip) {
                $arraysTmp = array(
                    'name' => $name,
                    'namezip' => $namezip
                );
            } else {
                throw new Zend_Exception(
                    "No se puede descargar el paquete $name con versión $version"
                );
            }
        }
        file_put_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.json",
            json_encode($temp)
        );
        unlink(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.lock"
        );
        //jose//
        shell_exec(
            'rm -R ' . dirname(__FILE__) . "/../../../../web/controlpanel/repo/Install/" . $newName
        );
        $result = shell_exec(
            "cd " . dirname(__FILE__) . "/../../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
            "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer install"
        );
        $install = explode("<--", $result);
        $resp = array();
        for ($index = 0; $index < count($install) - 1; $index++) {
            if (strpos($install[$index], "$newName ($newVersion)")) {
                $tmp = explode('-->', $install[$index + 1]);
                array_push($resp, $tmp[0]);
            }
        }
        unlink(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/composer.lock"
        );
        $cmd = "cd " . dirname(__FILE__) . "/../../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
            "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer update $name";
        shell_exec($cmd);

        return $this->instalarPaquete(
            $resp[0],
            !$isConected,
            $conection,
            $opcion,
            $action,
            $versions,
            $arraysTmp
        );
    }

    public function dividirAcciones($acciones)
    {
        $resp = array(
            'instalar' => array(),
            'actualizar' => array(),
            'desinstalar' => array()
        );
        $listaAcciones = explode('-', $acciones);
        foreach ($listaAcciones as $key => $accion) {

            if (strpos($accion, ' instalará') != 0) {
                $accion = str_replace('<br />', '', $accion);
                $accion = explode(" ", $accion);

                $name = $accion[3];

                $version = str_replace('(', '', $accion[4]);
                $version = str_replace(')', '', $version);

                $pcero = ($version{0} == '7') ? '-alfa' : (($version{0} == '8') ? '-beta' : '-rc');
                $version = substr($version,1) . $pcero;

                /* $version = str_replace("\n", '',$listaAcciones[$key+1]);
                 $version = explode(' ',$version);
                 $v1 = str_replace(')', '-'.$version[0].')', $version[1]);*/
                //var_dump(rtrim($name) . rtrim($version)); die;

                array_push(
                    $resp['instalar'],
                    '-' . rtrim($name) .' ('. rtrim($version) .')'. '<br />'
                );
            } elseif (strpos($accion, 'actualizará') != 0) {
                $accion = str_replace('<br />', '', $accion);
                $accion = explode(" ", $accion);
                $nameUno = $accion[3];

                //$esquelt = str_replace("\n", '',$listaAcciones[$key+1]);
                //$esquelt = explode(' ',$esquelt);

                $version = str_replace('(', '', $accion[4]);
                $version = str_replace(')', '', $version);

                $pcero = ($version{0} == '7') ? '-alfa' : (($version{0} == '8') ? '-beta' : '-rc');
                $v1 = substr($version,1) . $pcero;

                $version = str_replace('(', '', $accion[7]);
                $version = str_replace(')', '', $version);

                $pcero = ($version{0} == '7') ? '-alfa' : (($version{0} == '8') ? '-beta' : '-rc');
                $v2 = str_replace("\n",'',substr($version,1) . $pcero);

                array_push(
                    $resp['actualizar'],
                    '-' . rtrim($nameUno) .' ('.rtrim($v1) .')'. ' a ' . $nameUno .' ('. rtrim($v2) .')'. '<br />'
                );
            } elseif (strpos($accion, 'desinstalará') != 0) {
                $accion = explode(" ", $accion);
                $name = $accion[3];
                $version = str_replace('(', '', $accion[4]);
                $version = str_replace(')', '', $version);
                array_push(
                    $resp['desinstalar'],
                    '-' . rtrim($name) . '(' . rtrim($version) . ')<br />'
                );
            }
        }
        if (count($resp['instalar']) == 0) {
            array_push($resp['instalar'], 'Sin cambios<br />');
        }
        if (count($resp['desinstalar']) == 0) {
            array_push($resp['desinstalar'], 'Sin cambios<br />');
        }
        if (count($resp['actualizar']) == 0) {
            array_push($resp['actualizar'], 'Sin cambios<br />');
        }

        return $resp;
    }

    public function dividirAcciones2($acciones)
    {
        $resp = array(
            'instalar' => array(),
            'actualizar' => array(),
            'desinstalar' => array()
        );


        $listaAcciones = explode('-', $acciones);
        foreach ($listaAcciones as $accion) {
            if (strpos($accion, ' instalará') != 0) {
                //$accion=  explode(" ", $accion);
                //$name=$accion[3];
                //$version=  str_replace('(', '', $accion[4]);
                //$version=  str_replace(')', '', $version);
                $accion = str_replace("Se instalará", '', $accion);
                array_push($resp['instalar'], '-' . rtrim($accion) . '<br />');
            } elseif (strpos($accion, 'actualizará') != 0) {

                $accion = str_replace("Se actualizará", '', $accion);
                $accion=  explode(" ", $accion);

                $nameUno = $accion[2];

                $version = str_replace('(', '', $accion[3]);
                $version = str_replace(')', '', $version);

                $pcero = ($version{0} == '7') ? '-alfa' : (($version{0} == '8') ? '-beta' : '-rc');
                $v1 = substr($version,1) . $pcero;

                $version = str_replace('(', '', $accion[6]);
                $version = str_replace(')', '', $version);

                $pcero = ($version{0} == '7') ? '-alfa' : (($version{0} == '8') ? '-beta' : '-rc');
                $v2 = str_replace("\n",'',substr($version,1) . $pcero);

                array_push(
                    $resp['actualizar'],
                    '-' . rtrim($nameUno) .' ('.rtrim($v1) .')'. ' a ' . $nameUno .' ('. rtrim($v2) .')'. '<br />'
                );

            } elseif (strpos($accion, 'desinstalará') != 0) {
                //$accion=  explode(" ", $accion);
                //$name=$accion[3];
                //$version=  str_replace('(', '', $accion[4]);
                //$version=  str_replace(')', '', $version);
                $accion = str_replace("Se desinstalará", '', $accion);
                array_push(
                    $resp['desinstalar'],
                    '-' . rtrim($accion) . '<br />'
                );
            }
        }
        if (count($resp['instalar']) == 0) {
            array_push($resp['instalar'], 'Sin cambios<br />');
        }
        if (count($resp['desinstalar']) == 0) {
            array_push($resp['desinstalar'], 'Sin cambios<br />');
        }
        if (count($resp['actualizar']) == 0) {
            array_push($resp['actualizar'], 'Sin cambios<br />');
        }

        return $resp;
    }

    public function copyZipHttp($name, $version)
    {
        $destino = dirname(__FILE__) . "/../../../../web/controlpanel/repo/trash/descarga/";
        $originalContent = file_get_contents(
            dirname(__FILE__) . "/../../../../web/controlpanel/repo/Install/composer/installed.json"
        );
        $tmp = json_decode($originalContent, true);
        foreach ($tmp as $packages) {
            if ($packages['name'] == $name && $packages['version'] == $version
            ) {
                $url = $packages['dist']['url'];
                chmod($destino, 0777);
                if (is_writable($destino)) {
                    $packageZip = file_get_contents($url, null, $this->getContextOptions());
                    $copy = file_put_contents(
                        dirname(__FILE__) . "/../../../../web/controlpanel/repo/trash/descarga/tmp.zip",
                        $packageZip
                    );
                    if ($copy) {
                        return "tmp.zip";
                    }
                } else {
                    throw new Zend_Exception(
                        'No tiene permiso de escritura en el area de descarga'
                    );
                }
            }
        }

        return false;
    }

    public function cleanCacheComposer()
    {
        $destino = dirname(__FILE__) . "/../../../../web/controlpanel/repo/.composer";
        if (is_dir($destino)) {
            $cmd = "rm -R $destino";
            shell_exec($cmd);
        }
    }

    public function getElementPackage($name, $version)
    {
        $dirRepo = dirname(__FILE__) . "/../../../../web/controlpanel/configuraciones/repo.json";
        $arrays = json_decode(file_get_contents($dirRepo), true);
        $arraysRepository = $arrays['repositories'];
        foreach ($arraysRepository as $repo) {
            $url = $repo['url'] . 'packages.json';
            $arraysPackages = json_decode(file_get_contents($url, null, $this->getContextOptions()), true);
            if (isset($arraysPackages['packages'][$name][$version])) {
                $result = $arraysPackages['packages'][$name][$version];

                return $result;
            }
        }

        return false;
    }

    public function getDateConecctionBySubSystem($subSystem)
    {
        $comun = 'comun/recursos/xml/modulesconfig.xml';
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirmoduleconfig = $dirApps . "$subSystem/$comun";
        $arrays = array();
        if (!file_exists($dirmoduleconfig)) {
            $arrays['bd'] = Zend_Registry::getInstance()->config->bd->session->bd;
            $arrays['host'] = Zend_Registry::getInstance()->config->bd->session->host;
            $arrays['port'] = Zend_Registry::getInstance()->config->bd->session->port;
            $arrays['usuario'] = Zend_Registry::getInstance()->config->bd->session->usuario;
            $arrays['password'] = Zend_Registry::getInstance()->config->bd->session->password;
        } else {
            $xml = new SimpleXMLElement(
                trim(file_get_contents($dirmoduleconfig))
            );
            $atribute = $xml->conn;
            $rsa = new ZendExt_RSA_Facade();
            $arrays['bd'] = $atribute['bd'];
            $arrays['host'] = $atribute['host'];
            $arrays['port'] = $atribute['port'];
            $arrays['usuario'] = $atribute['usuario'];
            $arrays['password'] = $rsa->decrypt($atribute['password']);
        }

        return $arrays;
    }

    public function ofuscarPhp($dirModule)
    {
        if (is_dir($dirModule)) {
            $params["fuente"] = $dirModule;
            exec("bencoder -f -w -o {$dirModule} -a {$dirModule} -r -l;");
        }
    }

    public function haveConection($name, $version)
    {
        $package = $this->getElementPackage($name, $version);
        $array = $package['extra']['script'];

        return (isset($array) && is_array($array) && count($array) > 0);
    }

    public function setQdbConn(PDO $qdbConn)
    {
        $this->_currentPdoConn = $qdbConn;
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