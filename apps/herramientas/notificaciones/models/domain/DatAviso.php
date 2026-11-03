<?php

class DatAviso extends BaseDatAviso
{
    const GENERIC_NOTIFICATION_NAME = "Aviso de propósito general";

    public function setUp()
    {
        parent::setUp();
        $this->HasOne(
            'NomTipoaviso',
            array('local' => 'idtipoaviso', 'foreign' => 'idtipoaviso')
        );
        $this->HasMany(
            'DatEventoAviso',
            array('local' => 'idaviso', 'foreign' => 'idaviso')
        );
        $this->HasMany(
            'DatAvisoDestinatarioViaContenido',
            array('local' => 'idaviso', 'foreign' => 'idaviso')
        );
    }

    public static function getByCreator($idcreator)
    {
        return Doctrine_Query:: create()->select(
            'idaviso as idaviso, activo as activo'
        )
            ->from(__CLASS__)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->where('creadopor = ?', $idcreator)
            ->execute();
    }

    public static function getTotal()
    {
        return Doctrine_Query::create()
            ->select('count(idaviso)')
            ->setHydrationMode(Doctrine :: HYDRATE_SINGLE_SCALAR)
            ->from('DatAviso')->execute();
    }

    public static function activarDesactivar($idaviso)
    {
        $aviso = Doctrine::getTable(__CLASS__)->find($idaviso);
        $aviso->activo = (integer)(!NotificacionesUtil::toStrictBoolean(
            $aviso->activo
        ));
        $aviso->save();
    }

    /**
     * getDefault
     * Devuelve un aviso de propósito general.
     *
     * @return int idaviso
     */
    public static function getDefault()
    {
        $defaultEvent = DatEvent:: getDefault();
        $nots = Doctrine_Query:: create()->select('idaviso as idaviso')
            ->from('DatEventoAviso')
            ->where('idevento = ?', $defaultEvent)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        $idaviso = $nots[0]['idaviso'];
        if (!$idaviso) {
            $aviso = new self();
            $aviso->denominacion = self :: GENERIC_NOTIFICATION_NAME;
            $aviso->idtipoaviso = NomTipoaviso:: getDefault();
            $aviso->creadopor = ZendExt_GlobalConcept:: getInstance(
            )->Perfil->idusuario;
            $aviso->save();
            $idaviso = $aviso->idaviso;
            $eventoAviso = new DatEventoAviso();
            $eventoAviso->idevento = $defaultEvent;
            $eventoAviso->idaviso = $idaviso;
            $eventoAviso->save();
        }

        return $idaviso;
    }

    /**
     * obtenerDenominaciones
     * Devuelve los nombres de los avisos
     *
     * @return array
     * @author Yordenis
     */
    public static function obtenerDenominaciones($pagina)
    {
        return Doctrine_Query::create()
            ->select('a.denominacion denominacion, a.idaviso id')
            ->from('DatAviso a')
            ->offset($pagina)
            ->limit(10)
            ->execute()
            ->toArray();
    }

    public static function getIdAvisoByDenominacion($idevento, $denominacion)
    {
        return Doctrine_Query::create()
            ->select('a.idaviso idEventoAviso, a.denominacion')
            ->from('DatAviso a')
            ->innerJoin('DatEnetoAviso ea')
            ->where(
                'a.idaviso = ea.idaviso and ea.idvento = ? and a.denominacion = ?',
                array($idevento, $denominacion)
            )
            ->execute()
            ->toArray();
    }

    public function preDelete($event)
    {
        foreach ($this->DatAvisoDestinatarioViaContenido as $avisoDestViaCont) {
            $avisoDestViaCont->DatDestinatario->delete();
            $avisoDestViaCont->DatContenido->delete();
        }
    }
}
