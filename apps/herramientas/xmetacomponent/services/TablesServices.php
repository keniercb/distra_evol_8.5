<?php

class TablesServices
{

    function __construct()
    {
        $this->tablaModel = new TablaModel();
        $this->tablaDomain = new DatTabla();
        $this->campoModel = new CampoModel();
        $this->relacionModel = new RelacionModel();
        $this->relacionDomain = new DatRelacion();
        $this->standard = new ZendExt_ClassStandard();
    }

    public function addConcept($arrParams)
    {
        return $this->tablaModel->adicionarTabla(
            $arrParams['esquema'],
            $arrParams['tabla'],
            $arrParams['arbol'],
            $arrParams['alias']
        );
    }

    public function eliminarConcepto($idtabla)
    {
        $tablaModelAux = new TablaModel();

        return $tablaModelAux->eliminarTabla($idtabla);
    }

    public function obtenerTablasDadoEsquema($esquema)
    {
        $tablaModelAux = new TablaModel();
        $standard = new ZendExt_ClassStandard();

        return $standard->ArrayObject(
            $tablaModelAux->obtenerTablasDadoEsquema($esquema)
        );
    }

    public function createRelation($arrParams)
    {
        $tablaOrigen = DatTabla:: existeTabla(
            $arrParams['esquemaorigen'], $arrParams['tablaorigen']
        );
        $campoOrigen = DatCampo:: obtenerLLavePrimaria($tablaOrigen->idtabla);
        $campoDestino = $this->campoModel->adicionarCampo(
            $campoOrigen->denominacion,
            $arrParams['idtabladestino'],
            1, 19, 0, 0, 0, false
        );

        return $this->relacionModel->crearRelacion(
            $campoOrigen->idcampo, $campoDestino->idcampo,
            $arrParams['actualizar'], $arrParams['eliminar']
        );
    }

    public function importConcept($arrParams)
    {
        return $this->tablaModel->importarTabla(
            $arrParams['esquema'], $arrParams['tabla']
        );
    }

    public function getMetaOfImportedTable($arraParams)
    {
        $idtablaimportada = $this->tablaDomain->existeTabla(
            $arraParams['esquema'], $arraParams['tabla']
        );

        return $this->relacionDomain->obtenerRelacionesTabla(
            $idtablaimportada->idtabla
        );
    }

}