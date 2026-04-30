package MemorIA.service;

import MemorIA.entity.Reminder;

import java.util.List;

public interface IReminderService {
    Reminder createReminder(Reminder reminder);

    Reminder updateReminder(Long id, Reminder reminder);

    void deleteReminder(Long id);

    Reminder getReminderById(Long id);

    List<Reminder> getRemindersByPatientId(Long patientId);

    List<Reminder> getRemindersByPatientIdAndStatus(Long patientId, String status);

    List<Reminder> getUpcomingReminders(Long patientId);

    void completeReminder(Long id);
}
