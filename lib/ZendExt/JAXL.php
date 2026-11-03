<?php

/**
 * Created by PhpStorm.
 * User: aleks
 * Date: 26/05/16
 * Time: 13:52
 */
class ZendExt_JAXL extends JAXL
{
    /**
     * @param array     $to
     * @param string    $body
     * @param null      $thread
     * @param null      $subject
     */
    public function send_chat_msg($to, $body, $thread=null, $subject=null) {
        foreach($to as $destiny) {
            $msg = new XMPPMsg(
                array(
                    'type' => 'chat',
                    'to' => $destiny,
                    'from' => $this->full_jid->to_string()
                ),
                $body,
                $thread,
                $subject
            );
            $this->send($msg);
        }
        $this->send_end_stream();
    }
}
