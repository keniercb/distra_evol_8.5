<?php

/**
 * Created by PhpStorm.
 * User: jose
 * Date: 28/04/14
 * Time: 14:00
 */
class ControlPanelJson extends ZendExt_Model
{

    public function ControlPanelJsonModel()
    {
        parent::ZendExt_Model();

    }

    public function getDireccionPaqueteJson()
    {
        return dirname(__FILE__)
        . '/../../../../web/controlpanel/repo/components.json';
    }

    public function getDireccionRepositorioJson()
    {
        return dirname(__FILE__)
        . '/../../../../web/controlpanel/configuraciones/repo.json';
    }

    public function getDireccionRepositorioComposerJson()
    {
        return dirname(__FILE__)
        . '/../../../../web/controlpanel/repo/composer.json';
    }

    public function adicionarPaqueteArchivoJson($paquete)
    {
        $fileNameJson = $this->getDireccionPaqueteJson();
        $strDatos = file_get_contents($fileNameJson);
        $datos = json_decode($strDatos, true);
        $datos["PAQUETES"][] = $paquete;
        $fh = fopen($fileNameJson, 'w');
        fwrite($fh, json_encode($datos));
        fclose($fh);
    }

    public function escribirEnJson($direccionFile, $array)
    {
        $fh = fopen($direccionFile, 'w');
        fwrite($fh, json_encode($array));
        fclose($fh);
    }

    public function adicionarRepositorioInactivosArchivoJson($repositorio)
    {
        $fileNameJson = $this->getDireccionRepositorioJson();
        $strDatos = file_get_contents($fileNameJson);
        $datos = json_decode($strDatos, true);
        $datos["inactives"][] = $repositorio;
        if (is_writeable($fileNameJson)) {
            file_put_contents($fileNameJson, json_encode($datos));
        } else {
            throw new Exception("El fichero no tiene permiso de escritura.");
        }

    }

    public function adicionarRepositorioActivosArchivoJson($repositorio)
    {
        $fileNameJson = $this->getDireccionRepositorioJson();
        $strDatos = file_get_contents($fileNameJson);
        $datos = json_decode($strDatos, true);
        $datos["repositories"][] = $repositorio;
        file_put_contents($fileNameJson, json_encode($datos));
    }

    public function eliminarPaquete($datos, $pos)
    {
        $fileNameJson = $this->getDireccionPaqueteJson();
        unset($datos['PAQUETES'][$pos]);
        $datos['PAQUETES'] = array_values($datos['PAQUETES']);
        $fh = fopen($fileNameJson, 'w');
        fwrite($fh, json_encode($datos));
        fclose($fh);
    }

    public function eliminarRepositorio($datos, $pos, $isActive)
    {
        $fileNameJson = $this->getDireccionRepositorioJson();
        $reposActivos = array();
        $i = -1;
        if ($isActive) {
            foreach ($datos['repositories'] as $repositorio) {
                $i++;
                if ($i != $pos) {
                    array_push($reposActivos, $repositorio);
                }
            }

            $datos['repositories'] = $reposActivos;
            $tmp = $datos;
            array_push($reposActivos, array('packagist' => false));
            $datos['repositories'] = $reposActivos;
            $this->modificarComposerJson($reposActivos);
            file_put_contents($fileNameJson, json_encode($tmp));
        } else {
            foreach ($datos['inactives'] as $repositorio) {
                $i++;
                if ($i != $pos) {
                    array_push($reposActivos, $repositorio);
                }
            }
            $datos['inactives'] = $reposActivos;
            file_put_contents($fileNameJson, json_encode($datos));
        }

    }

    public function modificarActiveRepo($datas)
    {

        $fileNameJson = $this->getDireccionRepositorioJson();

        $strDatos = file_get_contents($fileNameJson);

        $datos = json_decode($strDatos, true);
        $repositories = array();
        $repoInatives = array();
        foreach ($datas as $data) {
            $repo = array(
                'type'         => 'composer',
                'url'          => $data['DIR'],
                'denominacion' => $data['text']
            );
            if ($data['active'] == '1' || $data['active'] == true) {
                array_push($repositories, $repo);
            } else {
                array_push($repoInatives, $repo);
            }

        }
        $datos['repositories'] = $repositories;
        $datos['inactives'] = $repoInatives;
        file_put_contents($fileNameJson, json_encode($datos));
        $repo = array(
            "packagist" => false
        );
        array_push($repositories, $repo);
        $this->modificarComposerJson($repositories);
    }

    private function modificarComposerJson($repositories = array())
    {

        $fileNameJson = $this->getDireccionRepositorioComposerJson();
        $strDatos = file_get_contents($fileNameJson);
        $datos = json_decode($strDatos, true);
        $datos['repositories'] = $repositories;
        file_put_contents($fileNameJson, json_encode($datos));

    }
} 