<?php

class DatCampoModel extends ZendExt_Model
{

    public function DatCampoModel()
    {
        parent::ZendExt_Model();
    }

    public function guardarDatosCampo($p)
    {
        try {

            $objCampo = Doctrine::getTable('DatCampo')->find($p->idcampo);
            $objCampo->denominacion = $p->sourceMostrar->denominacion;
            $objCampo->descripcion = $p->sourceMostrar->descripcion;
            $objCampo->alias = $p->sourceMostrar->alias;
            $objCampo->save();

            //Guarda datos mostrar
            $objConfigMostrar = Doctrine::getTable('DatConfigmostrar')->find($p->sourceMostrar->idconfigmostrar);
            $objConfigMostrar->anchocolumna = $p->sourceMostrar->anchoColumna;
            $objConfigMostrar->obligatorio = $p->sourceMostrar->obligatorio;
            $objConfigMostrar->expander = $p->sourceMostrar->expander;
            $objConfigMostrar->agruparcampo = $p->sourceMostrar->agruparCampo;
            $objConfigMostrar->tooltip = $p->sourceMostrar->tooltip;
            $objConfigMostrar->oculto = $p->sourceMostrar->oculto;
            $objConfigMostrar->renderer = $p->sourceMostrar->renderer;
            $objConfigMostrar->sqlselect = $p->sourceMostrar->sqlSelect;

            $objConfigMostrar->save();

            //Guarda datos condicion
            $objConfigCondicion = Doctrine::getTable('DatConfigcondicion')->find(
                $p->sourceCondicion->idconfigcondicion
            );
            $objConfigCondicion->usarcondicion = $p->sourceCondicion->usarCondicion;
            $objConfigCondicion->tipodato = $p->sourceCondicion->tipoDato;
            $objConfigCondicion->usarreemplazar = $p->sourceCondicion->usarReemplazar;
            $objConfigCondicion->representartbar = $p->sourceCondicion->mostrarEnToolbar;
            $objConfigCondicion->condicionpordefecto = $p->sourceCondicion->condicionPorDefecto;
            $objConfigCondicion->expresionregular = $p->sourceCondicion->expresionRegular;
            $objConfigCondicion->sqlwhere = $p->sourceCondicion->sqlWhere;
            $objConfigCondicion->sqlfilter = $p->sourceCondicion->sqlFilter;
            $objConfigCondicion->idtabla = $p->sourceCondicion->idtabla;
            $objConfigCondicion->save();

            //Elimino todos los valores que tenia guardado
            $q = Doctrine_Query::create()
                ->delete('DatMultievaluado')
                ->where('idcampo = ?', $p->idcampo)
                ->execute();

            //Guarda datos multievaluado
            if (!empty($p->arrMultievaluado)) {
                //Adiciono los nuevos valores
                $objMultievaluado = new Doctrine_Collection('DatMultievaluado');
                foreach ($p->arrMultievaluado as $key => $fila) {
                    $objMultievaluado[$key]->idcampo = $p->idcampo;
                    $objMultievaluado[$key]->valor = $fila->valor;
                    $objMultievaluado[$key]->denominacion = $fila->denominacion;
                }
                $objMultievaluado->save();
            }
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    public function verificarCampo($idconfiguracion, $alias, $idcampo)
    {
        $existe = DatCampo::verificarCampo($idconfiguracion, $alias, $idcampo);
        if ($existe) {
            return false;
        }
        return true;
    }
    public function cambiarOrden($idcampo,$idpadre,$posicion)
    {
        $connection = Doctrine_Manager::getInstance()->getCurrentConnection();
        $ordenNuevo = (is_numeric($posicion)) ? $posicion : 0;
        $result = $connection->fetchAll(
            "SELECT mod_reccomplejas2.f_cambiar_orden($idcampo,$idpadre, $posicion)"
        );

        return $result;
    }

}