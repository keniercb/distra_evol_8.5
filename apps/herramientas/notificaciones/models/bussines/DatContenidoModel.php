<?php

abstract class DatContenidoModel extends ZendExt_Model
{
    public function DatContenidoModel()
    {
        parent::ZendExt_Model();
    }

    protected function insertardat_contenido()
    {
        $content = new DatContenido();
        $content->idtipocont = NomTipocontenido:: getId((string)$this);
        $content->save();

        return $content->idcontenido;
    }

    protected function modificardat_contenido(DatContenido $datContenido)
    {
        $datContenido->save();
    }

    protected function eliminardat_contenido(DatContenido $datContenido)
    {
        $datContenido->delete();
    }

    public function __toString()
    {
        $classNameParts = explode(
            ' ', NotificacionesUtil:: spacify(get_class($this))
        );

        return strtolower($classNameParts[1]);
    }
}