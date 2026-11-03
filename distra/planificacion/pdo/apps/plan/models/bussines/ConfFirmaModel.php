<?php

class ConfFirmaModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(ConfFirma $confFirma)
    {
        $confFirma->save();
    }

    public function Actualizar(ConfFirma $confFirma)
    {
        $confFirma->save();
    }

    public function Eliminar($confFirma)
    {
        $confFirma->delete();
    }

    public function ConfigurarFirma($datos)
    {
        $objconffirma = Doctrine::getTable('ConfFirma')->find(
            $datos->idusuario
        );
        if ($objconffirma->idusuario) {
            $objconffirma->cargoaprueba = $datos->cargoaprueba;
            $objconffirma->gradoaprueba = $datos->gradoaprueba;
            $objconffirma->nombreaprueba = $datos->nombreaprueba;
            $objconffirma->cargoelabora = $datos->cargoelabora;
            $objconffirma->gradoelabora = $datos->gradoelabora;
            $objconffirma->nombrelabora = $datos->nombreelabora;
            $objconffirma->save();
        }
        if (!$objconffirma->idusuario) {
            $objconffirma = new ConfFirma();
            $objconffirma->idusuario = $datos->idusuario;
            $objconffirma->cargoaprueba = $datos->cargoaprueba;
            $objconffirma->gradoaprueba = $datos->gradoaprueba;
            $objconffirma->nombreaprueba = $datos->nombreaprueba;
            $objconffirma->cargoelabora = $datos->cargoelabora;
            $objconffirma->gradoelabora = $datos->gradoelabora;
            $objconffirma->nombrelabora = $datos->nombreelabora;
            $objconffirma->save();
        }
    }

    public function CargarConfiguracionFirma($idusuario)
    {
        $objfirma = Doctrine::getTable('ConfFirma')->find($idusuario);
        $cad .= "{idusuario: '" . $objfirma->idusuario . "', cargoaprueba: '"
            . $objfirma->cargoaprueba . "', gradoaprueba: '"
            . $objfirma->gradoaprueba . "', nombreaprueba: '"
            . $objfirma->nombreaprueba . "', cargoelabora: '"
            . $objfirma->cargoelabora . "', gradoelabora: '"
            . $objfirma->gradoelabora . "', nombrelabora: '"
            . $objfirma->nombrelabora . "'}";
        return $cad;
    }

}

