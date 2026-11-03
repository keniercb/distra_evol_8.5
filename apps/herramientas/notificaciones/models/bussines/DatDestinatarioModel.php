<?php

/**
 * DatDestinatarioModel
 *
 * @author Ernesto Herrera Morales
 */
abstract class DatDestinatarioModel extends ZendExt_Model
{

    protected $type;
    protected $typeid;

    const DESTINATARIO_SUFIX = 'Notificaciones';

    public function DatDestinatarioModel()
    {
        parent::ZendExt_Model();
    }

    protected function insertardat_destinatario()
    {
        $datDestinatario = new DatDestinatario();
        $datDestinatario->idtipodest = $this->getTypeId();
        $datDestinatario->save();

        return $datDestinatario->iddestinatario;
    }

    protected function modificardat_destinatario(
        DatDestinatario $datDestinatario
    )
    {
        $datDestinatario->save();
    }

    protected function eliminardat_destinatario(
        DatDestinatario $datDestinatario
    )
    {
        $datDestinatario->delete();
    }

    protected function existe($concretDestClass, $idConcretDest)
    {
        $concretDestObj = new $concretDestClass();
        $fkId = 'id' . strtolower($this->type);
        $concretDestObj->$fkId = $idConcretDest;
        $info = $concretDestObj->getInfo();

        return (count($info) > 0) ? $info[0][($this->type == 'Grupo')
            ? 'iddestinatario' : 'iddestinatario'] : null;
    }

    public static function getByAviso($idaviso, $start = 0, $limit = 10)
    {
        $dests = DatDestinatario:: getByAviso($idaviso, $start, $limit);
        $i = 0;
        foreach ($dests as $dest) {
            $dests[$i++]['contacto'] = self:: getName($dest['idcontacto']);
        }

        return $dests;
    }

    public static function getTotalByAviso($idaviso)
    {
        return DatDestinatario::getTotalByAviso($idaviso);
    }

    public static function existeDestinatario($idTipoDest, $idConcretDest)
    {
        $tipoDest = NomTipoDestinatario:: getType($idTipoDest);
        $concretDestClass = 'Dat' . $tipoDest . self :: DESTINATARIO_SUFIX;
        $concretModelClass = $concretDestClass . 'Model';
        $objDest = new $concretModelClass();

        return array($objDest->existe($concretDestClass, $idConcretDest),
                     $tipoDest);
    }

    public final function getGroupsOf($iddest)
    {
        return Doctrine_Query:: create()
            ->from('DatGrupoDestinatario')
            ->where('iddestinatario = ?', $iddest)
            ->execute()
            ->toArray();
    }

    public final function isGroup($iddest = null)
    {
        if ($iddest !== null) {
            return ($this->type == ((string)new DatGrupoNotificacionesModel()));
        } else {
            $q = Doctrine_Query:: create()
                ->from('DatGrupoNotificaciones')
                ->where('iddestinatario = ?', $iddest)
                ->execute()
                ->toArray();

            return count($q) === 1;
        }
    }

    public static final function getName($iddest)
    {
        $destModel = self:: getConcretDestinatarioModel($iddest);
        if ($destModel instanceof self) {
            return $destModel->getFullName($iddest);
        }

        return null;
    }

    public final function getTypeId()
    {
        if (!isset($this->typeid)) {
            $q = Doctrine_Query::create();
            $alias = 'typeid';
            $q = $q->select('idtipodest ' . $alias)
                ->from('NomTipoDestinatario')
                ->where('denominacion = ?', $this->type)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
            $this->typeid = $q[0][$alias];
        }

        return $this->typeid;
    }

    public static function insertarDestinatario($idtipodest, $concretid)
    {
        $dest = DatDestinatarioModel:: existeDestinatario(
            $idtipodest, $concretid
        );
        $iddest = $dest[0];
        if ($iddest == null) {
            $tipo = $dest[1];
            $concretDestinatarioClass = 'Dat' .
                $tipo .
                DatDestinatarioModel :: DESTINATARIO_SUFIX;
            $objConcretDestinatario = new $concretDestinatarioClass();
            $columnFk = 'id' . strtolower($tipo);
            $concretDestinatarioModelClass
                = $concretDestinatarioClass . 'Model';
            $objConcretDestinatarioModel = new $concretDestinatarioModelClass();
            $insertarConcretDestinatarioMethod
                = 'insertar_' . strtolower($concretDestinatarioClass);
            if (!$objConcretDestinatarioModel->isGroup()) {
                $objConcretDestinatario->$columnFk = $concretid;
            }
            $objConcretDestinatarioModel->$insertarConcretDestinatarioMethod(
                $objConcretDestinatario
            );
            $iddest = $objConcretDestinatario->iddestinatario;
        }

        return $iddest;
    }

    public static function getConcretDestinatarioModel($iddest)
    {
        $destObj = Doctrine:: getTable('DatDestinatario')->find($iddest);
        if ($destObj) {
            if ($destObj->DatGrupoNotificaciones->count()) {
                return new DatGrupoNotificacionesModel();
            } elseif ($destObj->DatPersonaNotificaciones->count()) {
                return new DatPersonaNotificacionesModel();
            } elseif ($destObj->DatEstructuraNotificaciones->count()) {
                return new DatEstructuraNotificacionesModel();
            } else {
                //@TODO excepción
            }
        } else {
            //@TODO excepción
        }
    }

    public function __toString()
    {
        return $this->type;
    }

    public abstract function getConcretDestinatarios($iddest);

    public abstract function getFullName($iddest);
    

    //-----------------------metodos para notificar por correos en CEIN---------------------------
    public static function obtenerDestinatariosdadoGrupo($denomgrupo){
        $dests = DatDestinatario::obtenerDestinatariosdadoGrupo($denomgrupo);
        $i = 0;
        foreach ($dests as $dest) {
            $dests[$i++]['contacto'] = self:: getName($dest['idcontacto']);
        }

        return $dests;
    }

    //obtener dado un arreglo de destinatarios los correos electronicos
    public function getConcretDestinatariosByType($destinatarios){

        $concretDestinatarios = array();

        foreach ($destinatarios as $destinatario) {
            $concretDestinatarioModel = DatDestinatarioModel :: getConcretDestinatarioModel(
                $destinatario['idcontacto']
            );
            array_push(
                $concretDestinatarios, $concretDestinatarioModel->getConcretDestinatarios($destinatario['idcontacto'])
            );
        }

        $contactAddresses = array();
        $ctos = array();

        try {
            foreach ($concretDestinatarios as $dest) {
                $destinatario = $dest["Persona"];
                array_push($ctos,$this->integrator->pvd->obtenerDatosContacto($destinatario));
            }
        }catch(Exception $e){
            ZendExt_Logger::write($e->getTraceAsString());
        }

        foreach ($ctos as $cto) {
            array_push($contactAddresses, $cto->data[0]['contacto']);
        }


        return $contactAddresses;
    }
}
