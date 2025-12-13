from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.utils import timezone
from datetime import timedelta
import pandas as pd

from users.models import User
from events.models import Event
from payments.models import Payment

class DashboardAnalyticsView(APIView):
    """
    Provides aggregated weekly data for the admin dashboard's summary table.

    This view is accessible only to admin users. It returns counts of new users,
    events, and successful payments for the last four full weeks.
    """
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        # Define the time range for the analytics: the last 4 weeks (28 days)
        end_date = timezone.now().date()
        start_date = end_date - timedelta(weeks=4)
        
        # --- Data Fetching ---
        # Fetch the creation dates of all relevant records within the time range.
        
        user_dates = pd.to_datetime(
            list(User.objects.filter(date_joined__date__gte=start_date).values_list('date_joined__date', flat=True))
        )
        event_dates = pd.to_datetime(
            list(Event.objects.filter(created_at__date__gte=start_date).values_list('created_at__date', flat=True))
        )
        payment_dates = pd.to_datetime(
            list(Payment.objects.filter(status='succeeded', created_at__date__gte=start_date).values_list('created_at__date', flat=True))
        )

        # --- Data Processing with Pandas ---

        # Create pandas Series for each set of dates
        user_series = pd.Series(1, index=user_dates, name="profileCreations")
        event_series = pd.Series(1, index=event_dates, name="eventCreations")
        payment_series = pd.Series(1, index=payment_dates, name="successfulPayments")

        # Resample each series to a weekly frequency, counting the entries.
        # 'W-MON' means weekly, with the week ending on Monday.
        user_counts = user_series.resample('W-MON', label='left', closed='left').count()
        event_counts = event_series.resample('W-MON', label='left', closed='left').count()
        payment_counts = payment_series.resample('W-MON', label='left', closed='left').count()
        
        # Combine the counts into a single DataFrame
        df = pd.concat([user_counts, event_counts, payment_counts], axis=1).fillna(0)

        # Ensure the DataFrame covers the last 4 weeks, filling missing weeks with 0
        four_weeks_index = pd.date_range(end=end_date, periods=4, freq='W-MON')
        df = df.reindex(four_weeks_index, fill_value=0).astype(int)
        
        # Sort by week, newest first
        df = df.sort_index(ascending=False)

        # Format the DataFrame for the API response
        df.reset_index(inplace=True)
        df.rename(columns={'index': 'weekStart'}, inplace=True)
        df['weekStart'] = df['weekStart'].dt.strftime('%b %d, %Y')

        return Response(df.to_dict('records'))
